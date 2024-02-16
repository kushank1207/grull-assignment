import os

SECRET_KEY = os.environ.get('SECRET_KEY')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
SQLALCHEMY_DATABASE_URI = 'sqlite:///grull.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
