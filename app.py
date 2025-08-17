from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': '🎲 Lotto Analyzer - Railway SUCCESS!',
        'version': '1.0.0',
        'status': 'online',
        'endpoints': ['/health', '/test', '/info']
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'service': 'lotto-analyzer'})

@app.route('/test')
def test():
    import random
    return jsonify({
        'message': '🎉 Test completato con successo!',
        'lucky_numbers': sorted([random.randint(1, 90) for _ in range(5)]),
        'status': 'working perfectly!'
    })

@app.route('/info')
def info():
    return jsonify({
        'app': 'Lotto Analyzer',
        'version': '1.0.0',
        'author': 'carosello75',
        'railway_status': 'deployed successfully! 🚀',
        'features': ['API REST', 'Lucky numbers', 'Health checks']
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
