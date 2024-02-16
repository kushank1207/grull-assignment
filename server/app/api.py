from flask import Blueprint
from flask_restful import Api
from flask_cors import CORS
from .resources import UserRegistration, UserLogin, QuestList, ConfirmApplication, UploadCSV

api_bp = Blueprint('api', __name__)
CORS(api_bp)  # Apply CORS to this blueprint
api = Api(api_bp)

# Apply CORS specifically to this blueprint
CORS(api_bp, resources={r"/*": {"origins": "*"}})

# Setup the API resources routing
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(QuestList, '/quests')
api.add_resource(UploadCSV, '/task/upload_csv')
api.add_resource(ConfirmApplication, '/manager/confirm_application/<int:application_id>')
