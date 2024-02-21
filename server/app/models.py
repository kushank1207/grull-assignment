from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)  # Store hashed passwords
    specialization = db.Column(db.String(120))
    points = db.Column(db.Integer, default=0)
    role = db.Column(db.String(80))
    applications = db.relationship('Application', back_populates='user')

class Quest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    reward = db.Column(db.Integer, nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    manager = db.relationship('User', backref=db.backref('quests', lazy=True))
    applications = db.relationship('Application', back_populates='quest')

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    quest_id = db.Column(db.Integer, db.ForeignKey('quest.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # e.g., pending, approved, rejected
    application_text = db.Column(db.Text, nullable=True)
    quest = db.relationship('Quest', back_populates='applications')
    user = db.relationship('User', back_populates='applications')

