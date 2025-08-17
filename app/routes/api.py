from flask import Blueprint, jsonify, request
from datetime import datetime
import random
import json

bp = Blueprint('api', __name__)

@bp.route('/health')
def api_health():
    return jsonify({
        'status': 'healthy',
        'api': 'working',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'lotto-analyzer-api'
    })

@bp.route('/test')
def api_test():
    return jsonify({
        'message': '🎉 API Test completato con successo!',
        'lucky_numbers': sorted([random.randint(1, 90) for _ in range(5)]),
        'timestamp': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'status': 'working'
    })

@bp.route('/info')
def api_info():
    return jsonify({
        'app': 'Lotto Analyzer',
        'version': '1.0.0',
        'author': 'carosello75', 
        'features': [
            'Analisi statistiche lotto',
            'Generazione combinazioni',
            'Dashboard web interattiva',
            'API REST complete',
            'Deploy Railway ready'
        ],
        'endpoints': {
            'health': '/api/health',
            'test': '/api/test',
            'info': '/api/info',
            'demo': '/api/demo/numeri'
        }
    })

@bp.route('/demo/numeri')
def demo_numeri():
    """Genera numeri demo per test"""
    ruote = ['bari', 'cagliari', 'firenze', 'genova', 'milano', 
             'napoli', 'palermo', 'roma', 'torino', 'venezia']
    
    estrazione_demo = {
        'concorso': 5024,
        'data': datetime.now().strftime('%d/%m/%Y'),
        'numeri': {}
    }
    
    for ruota in ruote:
        estrazione_demo['numeri'][ruota] = sorted([random.randint(1, 90) for _ in range(5)])
    
    return jsonify({
        'message': 'Estrazione demo generata',
        'estrazione': estrazione_demo,
        'note': 'Numeri generati casualmente per test'
    })

@bp.route('/stats')
def basic_stats():
    """Statistiche base demo"""
    return jsonify({
        'frequenze': {
            str(i): random.randint(50, 200) for i in range(1, 91)
        },
        'ritardi': {
            str(i): random.randint(1, 100) for i in range(1, 91)
        },
        'ultima_estrazione': datetime.now().strftime('%d/%m/%Y'),
        'total_estrazioni': 1248
    })

@bp.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint non trovato'}), 404

@bp.errorhandler(500) 
def internal_error(error):
    return jsonify({'error': 'Errore interno server'}), 500
