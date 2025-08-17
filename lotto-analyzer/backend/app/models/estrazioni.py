from app import db
from datetime import datetime

class Estrazione(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data_estrazione = db.Column(db.DateTime, nullable=False)
    concorso = db.Column(db.Integer, nullable=False, unique=True)
    
    bari = db.Column(db.String(50))
    cagliari = db.Column(db.String(50))
    firenze = db.Column(db.String(50))
    genova = db.Column(db.String(50))
    milano = db.Column(db.String(50))
    napoli = db.Column(db.String(50))
    palermo = db.Column(db.String(50))
    roma = db.Column(db.String(50))
    torino = db.Column(db.String(50))
    venezia = db.Column(db.String(50))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Estrazione {self.concorso}>'
