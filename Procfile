
web: gunicorn app:app" | Out-File -FilePath "Procfile" -Encoding UTF8 -NoNewline

## 📝 FILE 8: .env (CREA PER SVILUPPO LOCALE)
@'
SECRET_KEY=lotto-analyzer-local-development-key
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///lotto.db
'@ | Out-File -FilePath ".env" -Encoding UTF8
