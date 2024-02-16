from .models import User, Quest  # Assuming Quest is also defined in your models.py
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

quest_parser = reqparse.RequestParser()
quest_parser.add_argument('title', required=True, help="Title cannot be blank.")
quest_parser.add_argument('description', required=True, help="Description cannot be blank.")
quest_parser.add_argument('duration', required=True, help="Duration cannot be blank.")
quest_parser.add_argument('reward', type=int, required=True, help="Reward cannot be blank.")
quest_parser.add_argument('points', type=int, required=True, help="Points cannot be blank.")

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

class QuestList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        quests = Quest.query.all()
        return [{'id': q.id, 'title': q.title, 'description': q.description, 'duration': q.duration, 'reward': q.reward, 'points': q.points} for q in quests], 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        data = quest_parser.parse_args()
        quest = Quest(**data)
        db.session.add(quest)
        db.session.commit()
        return {'message': 'Quest created successfully', 'quest_id': quest.id}, 201
    
    @jwt.additional_claims_loader
    def add_claims_to_access_token(identity):
        user = User.query.get(identity)
        return {
            'id': user.id,
            'username': user.username,
            'role': user.role
        }

class ConfirmApplication(Resource):
    pass

class UploadCSV(Resource):
    pass
    
    # @app.errorhandler(400)
    # def bad_request(error):
    #     return jsonify({'error': 'Bad request', 'message': str(error)}), 400