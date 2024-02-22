from .models import User, Quest, Application, Schedule
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from flask_restful import Resource, reqparse
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from app import jwt
from flask import jsonify
from datetime import datetime, timezone

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
quest_parser.add_argument('Fees', type=int, required=True, help="Fees cannot be blank.")
quest_parser.add_argument('start_time', required=False, help="Start time is optional.")
quest_parser.add_argument('end_time', required=True, help="End time cannot be blank.")


class QuestList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404

        if user.role == 'community_manager':
            quests = Quest.query.filter_by(manager_id=user_id).all()
        else:
            quests = Quest.query.all()

        quests_data = []
        for q in quests:
            duration = (q.end_time - q.start_time).total_seconds() / 3600

            quests_data.append({
                'id': q.id,
                'title': q.title,
                'description': q.description,
                'fees': q.fees,
                'start_time': q.start_time.isoformat(),
                'end_time': q.end_time.isoformat(),
                'duration': duration  # Duration in hours
            })
        return quests_data, 200
    
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'community_manager':
            return {'message': 'Unauthorized'}, 403
        
        data = quest_parser.parse_args()
        # Parse start_time and end_time from the request
        start_time = data.get('start_time')
        if start_time:
            start_time = datetime.fromisoformat(start_time)
        else:
            start_time = datetime.now(timezone.utc)  # Use timezone-aware datetime
        end_time = datetime.fromisoformat(data['end_time'])

        new_quest = Quest(
            title=data['title'], 
            description=data['description'], 
            fees=data['Fees'],  # Ensure this matches the correct field name
            manager_id=user_id, 
            start_time=start_time, 
            end_time=end_time
        )
        
        try:
            db.session.add(new_quest)
            db.session.commit()
            # Prepare a serializable dictionary for the response
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

        application = Application.query.get_or_404(application_id)
        application.status = status

        if status == 'approved':
            quest = Quest.query.get_or_404(application.quest_id)
            schedule = Schedule(
                quest_id=quest.id, 
                user_id=application.user_id, 
                start_time=quest.start_time, 
                end_time=quest.end_time
            )
            db.session.add(schedule)

        try:
            db.session.commit()
            return {'message': 'Application status updated successfully'}, 200
        except Exception as e:
            db.session.rollback()
            return {'message': 'Failed to update application status', 'error': str(e)}, 500
