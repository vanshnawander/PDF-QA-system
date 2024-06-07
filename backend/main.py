from fastapi import FastAPI, File, UploadFile
from langchain_community.llms.ollama import Ollama
from pydantic import BaseModel
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.schema.document import Document
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain.globals import set_llm_cache
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil,os,json

from langchain_community.cache import SQLiteCache

set_llm_cache(SQLiteCache(database_path=".langchain.db"))


DATA_PATH ="pdfs"
CHROMA_PATH = "chroma"
def vector_database_create():
    documents = load_documents()
    chunks = split_documents(documents)
    print(chunks)
    for i in chunks:
        print(i.metadata)
        print(type(i))
        # chunks.i.metadata['Ticker']="AAPL"
        print('------------------------------------------------------------------\n')
    add_to_chroma(chunks)

def load_documents():
    document_loader = PyPDFDirectoryLoader(DATA_PATH)
    return document_loader.load()


def split_documents(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    texts=  text_splitter.split_documents(documents)
    for idx, text in enumerate(texts):
        texts[idx].metadata['Ticker'] = 'AAPL'
    return texts


def add_to_chroma(chunks: list[Document]):
    
    db = Chroma(
        collection_name='AAPL1',
        persist_directory=CHROMA_PATH, embedding_function=OllamaEmbeddings(model="nomic-embed-text")
    )

    chunks_with_ids = calculate_chunk_ids(chunks)

    existing_items = db.get(include=[])  
    existing_ids = set(existing_items["ids"])
    print(f"Number of existing documents in DB: {len(existing_ids)}")

    new_chunks = []
    for chunk in chunks_with_ids:
        if chunk.metadata["id"] not in existing_ids:
            new_chunks.append(chunk)


    if len(new_chunks):
        print(f"👉 Adding new documents: {len(new_chunks)}")
        new_chunk_ids = [chunk.metadata["id"] for chunk in new_chunks]
        meta= ["AAPL1" for chunk in new_chunks]
        # print(new_chunks)
        db.add_documents(new_chunks, ids=new_chunk_ids)
        db.persist()
    else:
        print("✅ No new documents to add")


def calculate_chunk_ids(chunks):
    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source")
        page = chunk.metadata.get("page")
        current_page_id = f"{source}:{page}"
        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0
        chunk_id = f"{current_page_id}:{current_chunk_index}"
        last_page_id = current_page_id

        chunk.metadata["id"] = chunk_id

    return chunks



class Query(BaseModel):
    query: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True, 
    allow_methods=["GET", "POST", "PUT", "DELETE"],  
    allow_headers=["Authorization", "Content-Type", ], 
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/upload", status_code=201)
async def upload_files(file: UploadFile= File(...)):
    file_ext  = file.filename.split(".").pop()
    file_name = file.filename.split(".")[0]
    file_path = f"pdfs/{file_name}.{file_ext}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    vector_database_create()
    return {"success":True,"file_name": file_name, "file_path": file_path}



PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""
@app.get("/query")
def query(query:Query):
    query_text = query.query
    print(query_text)
    # return query_text
    embedding_function = OllamaEmbeddings(model="nomic-embed-text")
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    results = db.similarity_search_with_score(query_text, k=8)
    print(results)
    print(len(results))
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    # print(prompt)

    model = Ollama(model="mistral")
    response_text = model.invoke(prompt)

    sources = [doc.metadata.get("id", None) for doc, _score in results]
    formatted_response = f"Response: {response_text}\nSources: {sources}"
    print(formatted_response)
    return {"response":response_text,"sources":json.dumps(sources)}
    



PROMPT_TEMPLATE_QUESTIONS = """
create questions based only on the following context:

{context}

---

the questions created from this context are:
"""



@app.get("/generatequestions")
def generate_questions():
    embedding_function = OllamaEmbeddings(model="nomic-embed-text")
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    results = db.get()
    print(results['documents'][0])
    combined_text=""
    for i in range(0,len(results['documents']),10):
        context_text = "\n\n---\n".join([doc for doc in results['documents'][i:i+10]])
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE_QUESTIONS)
        prompt = prompt_template.format(context=context_text)
        # print(prompt)

        model = Ollama(model="llama3")
        response_text = model.invoke(prompt)
        combined_text+=response_text
        print(response_text)

    #sources = [doc.metadata.get("id", None) for doc, _score in results]
    #formatted_response = f"Response: {response_text}\nSources: {sources}"
    #print(formatted_response)
    return {"response":combined_text}
    #return {"Hello":123}



PROMPT_TEMPLATE_ENTITY = """
Answer the question based only on the following context:

{context}

---

From the above context identify all the sectors, subsectors, person names and associated designations if any, locations and names of Organizations.
Give the output in following format
- sectors: 
- subsectors:
- Person Names and their titles:
- Organization:
- locations mentioned:
"""



@app.get("/entity_extraction")
def entity_extraction():
    embedding_function = OllamaEmbeddings(model="nomic-embed-text")
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    results = db.get(limit=10)
    print(results['documents'][0])
    combined_text=""
    for i in range(0,len(results['documents']),10):
        context_text = "\n\n---\n".join([doc for doc in results['documents'][i:i+10]])
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE_ENTITY)
        prompt = prompt_template.format(context=context_text)
        # print(prompt)

        model = Ollama(model="llama3")
        response_text = model.invoke(prompt)
        combined_text+=response_text
        print(response_text)

    #sources = [doc.metadata.get("id", None) for doc, _score in results]
    #formatted_response = f"Response: {response_text}\nSources: {sources}"
    #print(formatted_response)
    return {"response":combined_text}


PROMPT_TEMPLATE_INSIGHTS = """
Answer the question based only on the following context:

{context}

---

From the above context generate insights and keypoints
"""



@app.get("/keyinsights")
def insights():
    embedding_function = OllamaEmbeddings(model="nomic-embed-text")
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    results = db.get(limit=10)

    context_text = "\n\n---\n\n".join([doc for doc in results['documents']])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE_INSIGHTS)
    prompt = prompt_template.format(context=context_text)
    # print(prompt)

    model = Ollama(model="mistral")
    response_text = model.invoke(prompt)

    # sources = [doc.metadata.get("id", None) for doc, _score in results]
    # formatted_response = f"Response: {response_text}\nSources: {sources}"
    # print(formatted_response)
    return {"response":response_text}


@app.post('/test123')
def run(query:Query):
    print("Running")
    print(query)
    return {"success":True}



@app.delete('/clear_database')
def delete_database():
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        # shutil.rmtree(DATA_PATH)
    return {"success":True}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000,reload=True)


