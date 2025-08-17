## 🎯 SOSTITUISCI QUESTI FILE COMPLETAMENTE

cd C:\Users\fabio\lotto-analyzer

## 📝 FILE 1: app.py (SOSTITUISCI TUTTO)
@'
import os
from app import create_app

# Crea l'applicazione Flask
app = create_app()

@app.route('/')
def home():
    """Homepage API"""
    return {
        'message': '🎲 Lotto Analyzer API',
        'version': '1.0.0',
        'status': 'running',
        'author': 'Fabio',
        'endpoints': {
            'health': '/health',
            'api_health': '/api/health',
            'api_test': '/api/test',
            'api_info': '/api/info'
        }
    }

@app.route('/health')
def health():
    """Health check semplice"""
    return {
        'status': 'healthy',
        'timestamp': '2024-08-17',
        'app': 'Lotto Analyzer'
    }

if __name__ == '__main__':
    # CRITICO per Railway: usa PORT environment variable
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0'  # Railway richiede host 0.0.0.0
    
    print(f"🚀 Starting Lotto Analyzer on {host}:{port}")
    print("📊 Endpoints available:")
    print("   / - Homepage")
    print("   /health - Health check")  
    print("   /api/health - API health")
    print("   /api/test - API test")
    
    app.run(host=host, port=port, debug=False)
'@ | Out-File -FilePath "app.py" -Encoding UTF8

## 📝 FILE 2: config.py (SOSTITUISCI TUTTO)
@'
import os
from dotenv import load_dotenv

# Carica variabili da .env (se esiste)
load_dotenv()

class Config:
    """Configurazione principale per Flask"""
    
    # Chiave segreta per sessioni
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'lotto-analyzer-development-secret-key-2024'
    
    # Database configuration
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
    # Fix per Railway PostgreSQL (cambia postgres:// in postgresql://)
    if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # SQLAlchemy settings
    SQLALCHEMY_DATABASE_URI = DATABASE_URL or 'sqlite:///lotto.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Debug settings (False in produzione)
    DEBUG = os.environ.get('FLASK_ENV') != 'production'
    
    # CORS settings per frontend
    CORS_ORIGINS = [
        'https://*.railway.app',
        'http://localhost:3000',
        'http://localhost:5173'
    ]
    
    # Railway specific
    PORT = int(os.environ.get('PORT', 5000))
    
    # Lotto settings
    RUOTE = [
        'BARI', 'CAGLIARI', 'FIRENZE', 'GENOVA', 'MILANO',
        'NAPOLI', 'PALERMO', 'ROMA', 'TORINO', 'VENEZIA', 'NAZIONALE'
    ]

class DevelopmentConfig(Config):
    """Configurazione sviluppo"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///lotto_dev.db'

class ProductionConfig(Config):
    """Configurazione produzione"""
    DEBUG = False

# Seleziona config basata su ambiente
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': Config
}
'@ | Out-File -FilePath "config.py" -Encoding UTF8

## 📝 FILE 3: app/__init__.py (SOSTITUISCI TUTTO)
@'
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

# Inizializza estensioni
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    """Factory per creare app Flask"""
    
    # Crea app Flask
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Inizializza estensioni
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config.get('CORS_ORIGINS', ['*']))
    
    # Registra blueprints con gestione errori
    try:
        from app.routes.api import bp as api_bp
        app.register_blueprint(api_bp, url_prefix='/api')
        print("✅ API routes registered successfully")
    except ImportError as e:
        print(f"⚠️ Could not import API routes: {e}")
        print("🔧 Creating minimal API routes...")
        
        # Crea routes minimali se non esistono
        from flask import Blueprint, jsonify
        api_bp = Blueprint('api', __name__)
        
        @api_bp.route('/health')
        def health():
            return jsonify({'status': 'healthy', 'api': 'minimal'})
            
        app.register_blueprint(api_bp, url_prefix='/api')
    
    # Log configuration
    if not app.debug:
        import logging
        logging.basicConfig(level=logging.INFO)
        app.logger.info('🎲 Lotto Analyzer startup')
    
    return app

# Import models (se esistono)
try:
    from app.models import estrazioni
except ImportError:
    print("⚠️ Models not found - database features will be limited")
'@ | Out-File -FilePath "app\__init__.py" -Encoding UTF8

## 📝 FILE 4: app/routes/__init__.py (CREA SE NON ESISTE)
"# Routes package for Lotto Analyzer" | Out-File -FilePath "app\routes\__init__.py" -Encoding UTF8

## 📝 FILE 5: app/routes/api.py (SOSTITUISCI TUTTO)
@'
from flask import Blueprint, jsonify, request
from datetime import datetime
import random
import os

# Crea blueprint per API
bp = Blueprint('api', __name__)

@bp.route('/health')
def health():
    """Health check dettagliato"""
    return jsonify({
        'status': 'healthy',
        'api': 'working',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0',
        'environment': os.environ.get('RAILWAY_ENVIRONMENT', 'local'),
        'port': os.environ.get('PORT', '5000')
    })

@bp.route('/test')
def test():
    """Test API con numeri casuali"""
    return jsonify({
        'message': '🎉 Lotto Analyzer API Test Successful!',
        'test_data': {
            'lucky_numbers_bari': sorted([random.randint(1, 90) for _ in range(5)]),
            'lucky_numbers_milano': sorted([random.randint(1, 90) for _ in range(5)]),
            'lucky_numbers_roma': sorted([random.randint(1, 90) for _ in range(5)])
        },
        'status': 'success',
        'timestamp': datetime.utcnow().isoformat()
    })

@bp.route('/info')
def info():
    """Informazioni app"""
    return jsonify({
        'app': 'Lotto Analyzer',
        'version': '1.0.0',
        'description': 'Sistema di analisi statistiche per il Gioco del Lotto',
        'author': 'Fabio',
        'features': [
            'Analisi frequenze numeri',
            'Calcolo ritardi per ruota', 
            'Generazione combinazioni intelligenti',
            'API REST complete',
            'Dashboard web interattiva'
        ],
        'endpoints': {
            'health': '/api/health',
            'test': '/api/test', 
            'info': '/api/info',
            'random_numbers': '/api/random'
        }
    })

@bp.route('/random')
def random_numbers():
    """Genera numeri casuali per test"""
    ruota = request.args.get('ruota', 'BARI').upper()
    count = min(int(request.args.get('count', 5)), 10)  # Max 10 numeri
    
    numeri = sorted([random.randint(1, 90) for _ in range(count)])
    
    return jsonify({
        'ruota': ruota,
        'numeri': numeri,
        'count': count,
        'generated_at': datetime.utcnow().isoformat()
    })

@bp.route('/version')
def version():
    """Versione API"""
    return jsonify({
        'api_version': '1.0.0',
        'app_version': '1.0.0',
        'python_version': '3.10+',
        'flask_version': '2.3.3'
    })

# Error handlers
@bp.errorhandler(404)
def not_found_error(error):
    return jsonify({
        'error': 'Endpoint not found',
        'available_endpoints': ['/health', '/test', '/info', '/random', '/version']
    }), 404

@bp.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'status': 'error'
    }), 500
'@ | Out-File -FilePath "app\routes\api.py" -Encoding UTF8
