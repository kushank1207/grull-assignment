from flask import Blueprint
from flask_restful import Api
from flask_cors import CORS
from .resources import UserRegistration, UserLogin, QuestList, ApplyToQuest, ApplicationUpdate, ApplicationList, ApplicationListQuest

api_bp = Blueprint('api', __name__)
CORS(api_bp)
api = Api(api_bp)

CORS(api_bp, resources={r"/*": {"origins": "*"}})

api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(QuestList, '/quests')
api.add_resource(ApplyToQuest, '/quests/<int:quest_id>/apply')
api.add_resource(ApplicationUpdate, '/applications/<int:application_id>/<string:status>')
api.add_resource(ApplicationListQuest, '/quests/<int:quest_id>/applications')
api.add_resource(ApplicationList, '/user/applications')