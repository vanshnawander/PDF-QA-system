# Project Setup

## Backend (FastAPI)

### Prerequisites

- Python 3.x
- Virtualenv

### Setup

1. Navigate to the `backend` folder:

    ```sh
    cd backend
    ```

2. Create a virtual environment:

    ```sh
    python -m venv venv
    ```

3. Activate the virtual environment:

    - On Windows:

        ```sh
        .\venv\Scripts\activate
        ```

    - On macOS/Linux:

        ```sh
        source venv/bin/activate
        ```

4. Install the required dependencies:

    ```sh
    pip install -r requirements.txt
    ```
7. Run the FastAPI app:

    ```sh
    python -m uvicorn main:app --reload
    ```

## Frontend (React)

### Prerequisites

- Node.js
- npm

### Setup

1. Navigate to the `frontend` folder:

    ```sh
    cd frontend
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Start the React app:

    ```sh
    npm run dev
    ```

