# Jupyter Notebook Prototype

## Overview
This project is a prototype implementation of a Jupyter Notebook using modern web technologies. Users can dynamically create files, add code cells, write Python code, and execute it with outputs displayed directly in the UI. The backend is powered by JupyterHub, which is integrated via Docker.

## Screenshots

![App Screenshot](https://github.com/Novato111/jupyter-assignment/blob/main/assest/1.png)


## Technologies Used
- **Frontend Framework**: React with TypeScript
- **UI Library**: NextUI
- **Form Management**: React Hook Form with Zod for schema validation
- **State Management and Server Communication**: TanStack Query
- **Routing**: React Router

## Features
1. **File Management**
   - Create, view, and manage a dynamic list of files.
2. **File Interaction**
   - Select a file to open in the main workspace.
   - Add code cells to files for Python code execution.
3. **Code Cells**
   - Write Python code in editable cells.
   - Execute code and view output.
4. **Execution Backend**
   - Backend powered by JupyterHub via Docker Compose.

## Setup Instructions

### Prerequisites
- Node.js installed.
- Docker and Docker Compose installed.
- Clone this repository.

### Frontend Setup
1. Navigate to the project directory:
   ```bash
   cd jupyter-assignment
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Clone the JupyterHub deployment repository:
   ```bash
   git clone https://github.com/jupyterhub/jupyterhub-deploy-docker.git
   ```
2. Navigate to the basic example directory:
   ```bash
   cd jupyterhub-deploy-docker/basic-example
   ```
3. Start the JupyterHub service using Docker Compose:
   ```bash
   docker-compose up
   ```

4. Access JupyterHub in your browser:
   - Navigate to `http://localhost:8000/hub/signup`.
   - Create an admin user with the credentials:
     ```json
     {
         "username": "admin",
         "password": "yourpassword",
         "confirmPassword": "yourpassword"
     }
     ```
   - Log in with the admin account.

5. Generate an API token:
   - Navigate to the Token page in JupyterHub and generate an authentication token for API access.

### CORS Configuration 

### this is important step 
When we are accesing the kernerls from the frontend we get CORS errors, I was able to figure out solution but i dont know if its the best solution
you have to start docker container for jupterhub and visit localhost:8000 and login/signup as admin and click "START SERVER" and go back to your docker you will see jupyter-admin running
click on it go to files home/jovyan/.jupyter/jupyter_server_config.py` and  Add the following configuration to the file  mentioned in the step3 


1. Ensure the Docker container for JupyterHub is running:
   - Check for a container named `jupyter-admin`.
2. Access the configuration file in the container:
   - Navigate to `home/jovyan/.jupyter/jupyter_server_config.py`.
3. Add the following configuration to the file:
   ```python
   # Configuration file for jupyter-server.
   c = get_config()  # noga
   c.ServerApp.allow_origin = 'http://localhost:5173'
   c.ServerApp.allow_credentials = True
   c.ServerApp.tornado_settings = {
       'headers': {
           'Access-Control-Allow-Origin': 'http://localhost:5173',
           'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
           'Access-Control-Allow-Headers': 'Content-Type, Authorization',
           'Access-Control-Allow-Credentials': 'true',
       }
   }
   ```
4. Save the file and restart the Docker container:
   ```bash
   docker-compose down
   docker-compose up
   ```
   This step ensures CORS errors are resolved when accessing `http://localhost:8000` via the React app frontend.

## Running the Application
1. Ensure the Docker backend is running and configured as described above.
2. Start the frontend using `npm run dev`.
3. Access the application in your browser at `http://localhost:5173`.

## Notes
- Make sure the backend server is running before starting the frontend.
- If you encounter any issues, check Docker logs and ensure the CORS settings are correctly applied.


## Support

For support, email sunnysarje@gmail.com or join our Slack channel.



