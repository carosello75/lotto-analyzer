from app import create_app, db

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db}

@app.route('/')
def index():
    return {
        'message': '🎲 Lotto Analyzer API',
        'version': '1.0.0',
        'status': 'running'
    }

@app.route('/api/health')
def health():
    return {'status': 'healthy', 'api': 'working'}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
