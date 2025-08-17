from flask import Flask, jsonify, render_template, request
import os
import random
from datetime import datetime, timedelta

app = Flask(__name__)

# ==================== API ROUTES ====================

@app.route('/api/')
def api_home():
    return jsonify({
        'message': '🎲 Lotto Analyzer API',
        'version': '1.0.0',
        'status': 'online',
        'endpoints': ['/api/health', '/api/test', '/api/estrazioni', '/api/stats']
    })

@app.route('/api/health')
def api_health():
    return jsonify({'status': 'healthy', 'service': 'lotto-analyzer'})

@app.route('/api/test')
def api_test():
    return jsonify({
        'message': '🎉 Test completato!',
        'lucky_numbers': sorted([random.randint(1, 90) for _ in range(5)]),
        'timestamp': datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    })

@app.route('/api/estrazioni/ultima')
def api_ultima_estrazione():
    """Simula ultima estrazione lotto"""
    ruote = ['bari', 'cagliari', 'firenze', 'genova', 'milano', 
             'napoli', 'palermo', 'roma', 'torino', 'venezia']
    
    estrazione = {
        'concorso': 5024,
        'data': datetime.now().strftime('%d/%m/%Y'),
        'numeri': {}
    }
    
    for ruota in ruote:
        estrazione['numeri'][ruota] = sorted([random.randint(1, 90) for _ in range(5)])
    
    return jsonify(estrazione)

@app.route('/api/stats/frequenze')
def api_frequenze():
    """Simula statistiche frequenze numeri"""
    frequenze = {}
    for i in range(1, 91):
        frequenze[str(i)] = random.randint(50, 200)
    
    return jsonify({
        'frequenze': frequenze,
        'periodo': 'Ultimi 100 concorsi',
        'aggiornato': datetime.now().strftime('%d/%m/%Y %H:%M')
    })

@app.route('/api/stats/ritardi')
def api_ritardi():
    """Simula statistiche ritardi"""
    ritardi = {}
    for i in range(1, 91):
        ritardi[str(i)] = random.randint(1, 150)
    
    return jsonify({
        'ritardi': ritardi,
        'periodo': 'Situazione attuale',
        'aggiornato': datetime.now().strftime('%d/%m/%Y %H:%M')
    })

@app.route('/api/genera/numeri')
def api_genera_numeri():
    """Genera combinazioni numeri"""
    tipo = request.args.get('tipo', 'ambo')
    ruota = request.args.get('ruota', 'nazionale')
    
    if tipo == 'ambo':
        numeri = sorted([random.randint(1, 90) for _ in range(2)])
    elif tipo == 'terno':
        numeri = sorted([random.randint(1, 90) for _ in range(3)])
    elif tipo == 'quaterna':
        numeri = sorted([random.randint(1, 90) for _ in range(4)])
    elif tipo == 'cinquina':
        numeri = sorted([random.randint(1, 90) for _ in range(5)])
    else:
        numeri = sorted([random.randint(1, 90) for _ in range(5)])
    
    return jsonify({
        'numeri': numeri,
        'tipo': tipo,
        'ruota': ruota,
        'generato': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'probabilita': f"1 su {random.randint(1000, 50000):,}"
    })

# ==================== FRONTEND ROUTES ====================

@app.route('/')
def home():
    """Homepage dashboard"""
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    """Dashboard statistiche"""
    return render_template('dashboard.html')

@app.route('/generator')
def generator():
    """Generatore numeri"""
    return render_template('generator.html')

@app.route('/stats')
def stats():
    """Pagina statistiche"""
    return render_template('stats.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
