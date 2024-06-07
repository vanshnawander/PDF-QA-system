import { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button, Spinner } from "@material-tailwind/react";
import axios from "axios";
export default function EntityRec(){
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fileupload, setFileUpload] = useState(false);
    const [query, setQuery] = useState();
    const [answers, setAnswers] = useState([]);


    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        const url = "upload";
        const { data } = await axios.post(url,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
          );
        if(data.error){
          alert(data.error);
          setIsLoading(false);
          return;

        }
        console.log(data);
        setIsLoading(false);
        alert('file successfully uploaded')
    }

    async function GetAnswers(){
        // if(fileupload===false){
        //     alert("Please upload the file first");
        //     return 
        // }
        console.log(query);
        setIsLoading(true);
        const {data} = await axios.get('entity_extraction');
        console.log(data);
        
        console.log(query);
        if(data.error){
            alert(data.error);
            setIsLoading(false);
            return;
        }
        setAnswers(data);
        setIsLoading(false);
    }

    return(
        <div className="flex justify-center">
            <div className="flex flex-wrap w-1/2 ">
            <h1 className="text-2xl font-bold m-5">Upload your pdf file </h1>
            <br />
            <form  onSubmit={handleSubmit} className="w-full">
                <label className='mb-[4px] block text-base font-medium text-dark dark:text-white'>
                 file upload in pdf format
                </label>
                <input
                    type='file'
                    placeholder='upload file '
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                    className='mb-3 w-4/6 bg-transparent rounded-md border border-stroke dark:border-dark-3 py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2'
                />
               
                <button className="bg-primary m-2 text-white p-2 rounded-md">Upload file</button>
            </form>
            
           <Button onClick={GetAnswers} className="bg-blue">Extract Entities</Button>
            {   
              isLoading && <Spinner className="h-12 w-12" />
            }

            {
                <div className="flex w-full">
                   { answers.response}
                </div>    
            }


        </div>
        </div>

    )
}