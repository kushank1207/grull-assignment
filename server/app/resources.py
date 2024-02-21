from .models import User, Quest, Application 
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from flask_restful import Resource, reqparse
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from app import jwt
from flask import jsonify

user_parser = reqparse.RequestParser()
user_parser.add_argument('username', required=True, help="Username cannot be blank.")
user_parser.add_argument('password', required=True, help="Password cannot be blank.")
user_parser.add_argument('specialization', required=False)
user_parser.add_argument('role', required=False, help="Role cannot be blank.", choices=('user', 'community_manager'))

def hash_password(password):
    return generate_password_hash(password)

class UserRegistration(Resource):
    def post(self):
        data = user_parser.parse_args()
        if User.query.filter_by(username=data['username']).first():
            return {'message': 'User with that username already exists'}, 400
        hashed_password = hash_password(data['password'])
        user = User(
            username=data['username'], 
            password=hashed_password, 
            specialization=data['specialization'], 
            role=data.get('role', 'user')
        )
        db.session.add(user)
        db.session.commit()
        return {'message': 'User created successfully'}, 201

class UserLogin(Resource):
    def post(self):
        data = user_parser.parse_args()
        print(f"Login attempt with data: {data}")
        user = User.query.filter_by(username=data['username']).first()
        if user and check_password_hash(user.password, data['password']):
            access_token = create_access_token(identity=user.id)
            role = user.role
            return {'access_token': access_token, 'role': role}, 200
        return {'message': 'Invalid credentials'}, 401
    

quest_parser = reqparse.RequestParser()
quest_parser.add_argument('title', required=True, help="Title cannot be blank.")
quest_parser.add_argument('description', required=True, help="Description cannot be blank.")
quest_parser.add_argument('reward', type=int, required=True, help="Reward cannot be blank.")

class QuestList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            # Directly return a dictionary; Flask-RESTful will handle serialization
            return {'message': 'User not found'}, 404
        
        if user.role == 'community_manager':
            quests = Quest.query.filter_by(manager_id=user_id).all()
        else:
            quests = Quest.query.all()

        quests_data = [{'id': q.id, 'title': q.title, 'description': q.description, 'reward': q.reward} for q in quests]
        return quests_data, 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'community_manager':
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = quest_parser.parse_args()
        new_quest = Quest(title=data['title'], description=data['description'], reward=data['reward'], manager_id=user_id)
        try:
            db.session.add(new_quest)
            db.session.commit()
            return {'message': 'Quest created successfully', 'quest_id': new_quest.id}, 201
        except Exception as e:
            db.session.rollback()
            return {'message': 'Failed to create quest', 'error': str(e)}, 500

    
    @jwt.additional_claims_loader
    def add_claims_to_access_token(identity):
        user = User.query.get(identity)
        return {
            'id': user.id,
            'username': user.username,
            'role': user.role
        }
    
application_parser = reqparse.RequestParser()
application_parser.add_argument('application_text', type=str, help="Application text is optional.", required=False)

class ApplyToQuest(Resource):
    @jwt_required()
    def post(self, quest_id):
        user_id = get_jwt_identity()
        parser = reqparse.RequestParser()
        parser.add_argument('application_text', required=True, help="Application text cannot be blank.")
        args = parser.parse_args()
        
        application = Application(quest_id=quest_id, user_id=user_id, application_text=args['application_text'])
        db.session.add(application)
        db.session.commit()
        return {'message': 'Application submitted successfully', 'application_id': application.id}, 201

# retreives all applications of the user
class ApplicationList(Resource):    
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        print("user", user)
        if not user:
            return {'message': 'User not found'}, 404
        applications = Application.query.filter_by(user_id=user_id).all()
        applications_data = [{
            'id': app.id,
            'quest_id': app.quest_id,
            'user_id': app.user_id,
            'status': app.status,
            'application_text': app.application_text
        } for app in applications]
        return applications_data, 200

# retreives application of a specific quest
class ApplicationListQuest(Resource):
    @jwt_required()
    def get(self, quest_id):
        user_id = get_jwt_identity()
        quest = Quest.query.get_or_404(quest_id)
        if not quest or quest.manager_id != user_id:
            return {'message': 'Unauthorized to view applications for this quest'}, 403

        applications = Application.query.filter_by(quest_id=quest_id).all()
        applications_data = [{
            'id': app.id,
            'quest_id': app.quest_id,
            'user_id': app.user_id,
            'status': app.status,
            'application_text': app.application_text
        } for app in applications]

        return jsonify(applications_data)
        
class ApplicationUpdate(Resource):
    @jwt_required()
    def put(self, application_id, status):
        if status not in ['pending', 'approved', 'rejected']:
            return {'message': 'Invalid status value'}, 400

        user_id = get_jwt_identity()
        application = Application.query.get_or_404(application_id)

        # ensuring whether the user is the manager of the quest
        quest = Quest.query.get_or_404(application.quest_id)
        if quest.manager_id != user_id:
            return {'message': 'Unauthorized'}, 403

        application.status = status
        db.session.commit()
        return {'message': 'Application status updated successfully'}


class UploadCSV(Resource):
    pass
    
    # @app.errorhandler(400)
    # def bad_request(error):
    #     return jsonify({'error': 'Bad request', 'message': str(error)}), 400