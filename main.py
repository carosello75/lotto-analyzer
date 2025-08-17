from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        'message': '🎲 Lotto Analyzer - RAILWAY SUCCESS!',
        'version': '1.0.0',
        'status': 'ONLINE',
        'timestamp': '2025-08-17'
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy'})

@app.route('/test')  
def test():
    import random
    return jsonify({
        'message': 'Test OK!',
        'numbers': [random.randint(1, 90) for _ in range(5)]
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
