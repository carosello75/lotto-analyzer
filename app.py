from flask import Flask, jsonify
import os

# Crea app Flask direttamente (senza factory pattern per ora)
app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': '🎲 Lotto Analyzer API - Railway Working!',
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
        'message': '🎉 Test completato!',
        'lucky_numbers': sorted([random.randint(1, 90) for _ in range(5)]),
        'status': 'working'
    })

@app.route('/info')
def info():
    return jsonify({
        'app': 'Lotto Analyzer',
        'version': '1.0.0',
        'author': 'carosello75',
        'railway': 'deployed successfully! 🚀'
    })

if __name__ == '__main__':
    # Railway PORT handling
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
