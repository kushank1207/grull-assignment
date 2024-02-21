# Project Name

#### Deployed Link  - https://grull-assignment-virid.vercel.app/

This project was developed as an assignment for Grull.work, aimed to create a basic MVP working model. 

## Features

- **User Registration/Signup**: Allows new users to register with a role assignment option of either 'user' or 'community-manager'.
- **Community Manager Dashboard**: Enables community managers to create quests and handle applications from users.
- **User Dashboard**: Users can apply to quests and search for them using keywords. 
- **Login System**: Secure login mechanism for users with credentials.
- **Quest Management**: Community managers can manage applications only for the quests they have created.
- **Search Funcationality**: The search functionality includes both exact word matching and fuzzy search algorithms.

## Technology Stack

- **Frontend**: React for building the user interface, Tailwind and Bootstrap for styling, hosted on Vercel.
- **Backend**: Python Flask application serving the API, hosted on Render.
- **Database**: PostgreSQL for data storage, hosted on Render.

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3 and pip
- PostgreSQL

### Setup

**Clone the Repository**

```
git clone https://github.com/kushank1207/grull-assignment.git
cd [project name]
```

**Frontend Setup**

Navigate to the frontend directory:

```
cd client
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm start
```

**Backend Setup**

Navigate to the backend directory:

```
cd server
```

Create a virtual environment and activate it:

```
python -m venv .venv
source .venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install dependencies:

```
pip install -r requirements.txt
```

Start the Flask application:

```
python3 flask run
```

## Backend Hosting on Render 

Our backend is built with Python Flask and hosted on Render. Due to the use of the **free tier**, applications may enter a sleep mode after a period of inactivity. As a result, **the first request after the application has been idle may experience a delay of up to 50 seconds**. This is a common optimization in cloud services to balance cost and resource efficiency. For a smoother user experience, consider implementing frontend loading indicators during initial loading times. 

## Environment Variables

To run the project successfully, you'll need to set up several environment variables. Here's a template of the required `.env` file for both the frontend and backend: 

```env
# Frontend .env
REACT_APP_API_URL="http://localhost:5000"
```

```
# Backend .env
FLASK_APP=run.py
FLASK_ENV=development
FLASK_RUN_HOST=0.0.0.0
FLASK_RUN_PORT=8000
DB_SECRET_KEY='your_database_secret_key_here'
JWT_SECRET_KEY='your_jwt_secret_key_here'
SQLALCHEMY_DATABASE_URI='your_database_url_here'
```



