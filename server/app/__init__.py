from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
load_dotenv() 

db = SQLAlchemy()

jwt = JWTManager()

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

    app.config.from_pyfile('config.py')
    # print("Database URI1:", os.environ.get("DB_SECRET_KEY"))
    # print("Database URI:", os.environ.get("SQLALCHEMY_DATABASE_URI"))
    migrate = Migrate(app, db)

    db.init_app(app)
    
    jwt.init_app(app)

    with app.app_context():
        from .models import User, Quest
        db.create_all()

    from .api import api_bp  # Import Blueprint
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
