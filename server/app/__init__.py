from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

    app.config.from_pyfile('config.py')
    

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from .models import User, Quest
        db.create_all()

    from .api import api_bp  # Import Blueprint
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
