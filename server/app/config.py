import os

SECRET_KEY = os.environ.get('SECRET_KEY')
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://peerjob_citizenhot:54aab961e028ec405636bfc4739050391c2604dc@v-s.h.filess.io:3306/peerjob_citizenhot'
SQLALCHEMY_TRACK_MODIFICATIONS = False
