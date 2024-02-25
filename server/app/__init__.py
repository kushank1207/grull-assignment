from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from flasgger import Swagger
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

    app.config.from_pyfile('config.py')
    migrate = Migrate(app, db)

    db.init_app(app)
    jwt.init_app(app)

    # Initialize Flasgger with Flask app
    Swagger(app, template_file='static/swagger.yaml')

    with app.app_context():
        from .models import User, Quest
        db.create_all()

    from .api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
