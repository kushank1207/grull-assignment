from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)  # Store hashed passwords
    specialization = db.Column(db.String(120))
    points = db.Column(db.Integer, default=0)
    role = db.Column(db.String(80))

class Quest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(300))
    duration = db.Column(db.String(50))
    reward = db.Column(db.Integer)
    points = db.Column(db.Integer)