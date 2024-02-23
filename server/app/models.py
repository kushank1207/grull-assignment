from . import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    specialization = db.Column(db.String(120))
    role = db.Column(db.String())
    applications = db.relationship('Application', back_populates='user')

class Quest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(2000), nullable=False)
    fees = db.Column(db.Integer, nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    manager = db.relationship('User', backref=db.backref('quests', lazy=True))
    start_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=False)
    applications = db.relationship('Application', back_populates='quest')
    
class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quest_id = db.Column(db.Integer, db.ForeignKey('quest.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    quest = db.relationship('Quest', backref=db.backref('schedules', lazy=True))
    user = db.relationship('User', backref=db.backref('schedules', lazy=True))

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quest_id = db.Column(db.Integer, db.ForeignKey('quest.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # e.g., pending, approved, rejected
    application_text = db.Column(db.Text, nullable=True)
    quest = db.relationship('Quest', back_populates='applications')
    user = db.relationship('User', back_populates='applications')

