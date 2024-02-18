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
            return jsonify({'message': 'User not found'}), 404
        
        if user.role == 'community_manager':
            quests = Quest.query.filter_by(manager_id=user_id).all()
        else:
            quests = Quest.query.all()
        
        return jsonify([{'id': q.id, 'title': q.title, 'description': q.description, 'reward': q.reward} for q in quests]), 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'community_manager':
            return jsonify({'message': 'Unauthorized'}), 403
        
        data = quest_parser.parse_args()
        new_quest = Quest(title=data['title'], description=data['description'], reward=data['reward'], manager_id=user_id)
        db.session.add(new_quest)
        db.session.commit()
        return jsonify({'message': 'Quest created successfully', 'quest_id': new_quest.id}), 201
    
    @jwt.additional_claims_loader
    def add_claims_to_access_token(identity):
        user = User.query.get(identity)
        return {
            'id': user.id,
            'username': user.username,
            'role': user.role
        }

application_parser = reqparse.RequestParser()
application_parser.add_argument('quest_id', type=int, required=True, help="Quest ID cannot be blank.")
application_parser.add_argument('user_id', type=int, required=True, help="User ID cannot be blank.")
application_parser.add_argument('application_text', required=False, help="Optional application text.")

class ConfirmApplication(Resource):
    @jwt_required()
    def post(self):
        data = application_parser.parse_args()
        new_application = Application(
            quest_id=data['quest_id'],
            user_id=get_jwt_identity(),  # Assuming JWT identity is the user's ID
            application_text=data.get('application_text', '')
        )
        db.session.add(new_application)
        db.session.commit()
        return {'message': 'Application submitted successfully'}, 201

application_update_parser = reqparse.RequestParser()
application_update_parser.add_argument('status', required=True, help="Status cannot be blank.", choices=('pending', 'approved', 'rejected'))
application_update_parser.add_argument('feedback', required=False, help="Optional feedback on the application.")
class UpdateApplicationStatus(Resource):
    @jwt_required()
    def put(self, application_id):
        data = application_update_parser.parse_args()
        application = Application.query.get_or_404(application_id)

        if get_jwt_identity() != application.quest.manager_id:
            return {'message': 'Unauthorized'}, 403
        
        application.status = data['status']
        application.feedback = data.get('feedback', '')
        db.session.commit()
        return {'message': 'Application status updated successfully'}, 200
    
class UploadCSV(Resource):
    pass
    
    # @app.errorhandler(400)
    # def bad_request(error):
    #     return jsonify({'error': 'Bad request', 'message': str(error)}), 400