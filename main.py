from flask import Flask, jsonify, render_template, request
import os
import random
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/generator') 
def generator():
    return render_template('generator.html')

@app.route('/stats')
def stats():
    return render_template('stats.html')

@app.route('/api/health')
def api_health():
    return jsonify({'status': 'healthy'})

@app.route('/api/estrazioni/ultima')
def api_ultima_estrazione():
    ruote = ['bari', 'cagliari', 'firenze', 'genova', 'milano', 'napoli', 'palermo', 'roma', 'torino', 'venezia']
    estrazione = {'concorso': 5024, 'data': datetime.now().strftime('%d/%m/%Y'), 'numeri': {}}
    for ruota in ruote:
        estrazione['numeri'][ruota] = sorted([random.randint(1, 90) for _ in range(5)])
    return jsonify(estrazione)

@app.route('/api/genera/numeri')
def api_genera_numeri():
    tipo = request.args.get('tipo', 'cinquina')
    ruota = request.args.get('ruota', 'nazionale')
    
    if tipo == 'ambo':
        numeri = sorted([random.randint(1, 90) for _ in range(2)])
    elif tipo == 'terno':
        numeri = sorted([random.randint(1, 90) for _ in range(3)])
    elif tipo == 'quaterna':
        numeri = sorted([random.randint(1, 90) for _ in range(4)])
    else:
        numeri = sorted([random.randint(1, 90) for _ in range(5)])
    
    return jsonify({
        'numeri': numeri,
        'tipo': tipo,
        'ruota': ruota,
        'generato': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'probabilita': '1 su 43.949.268' if ruota != 'tutte' else '1 su 439.492 (10x migliore!)'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
