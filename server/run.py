from app import create_app
import os
from dotenv import load_dotenv
load_dotenv() 

app = create_app()

if __name__ == '__main__':
    app.run(host=os.getenv('FLASK_RUN_HOST'),port=int(os.getenv('FLASK_RUN_PORT')))
