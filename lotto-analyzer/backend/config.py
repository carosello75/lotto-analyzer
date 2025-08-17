import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'lotto-analyzer-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///lotto.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    RUOTE = [
        'BARI', 'CAGLIARI', 'FIRENZE', 'GENOVA', 'MILANO',
        'NAPOLI', 'PALERMO', 'ROMA', 'TORINO', 'VENEZIA'
    ]
