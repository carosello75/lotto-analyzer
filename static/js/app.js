// Lotto Analyzer JavaScript App

class LottoAnalyzer {
    constructor() {
        this.baseURL = window.location.origin;
        this.init();
    }

    init() {
        this.loadUltimaEstrazione();
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    showWelcomeMessage() {
        console.log('🎲 Lotto Analyzer caricato con successo!');
        console.log('API Base URL:', this.baseURL);
    }

    setupEventListeners() {
        // Generatore numeri
        const btnGenera = document.getElementById('genera-numeri');
        if (btnGenera) {
            btnGenera.addEventListener('click', () => this.generaNumeri());
        }

        // Auto-refresh ultima estrazione ogni 30 secondi
        setInterval(() => this.loadUltimaEstrazione(), 30000);
    }

    async loadUltimaEstrazione() {
        try {
            const response = await fetch(`${this.baseURL}/api/estrazioni/ultima`);
            const data = await response.json();
            this.displayUltimaEstrazione(data);
        } catch (error) {
            console.error('Errore caricamento estrazione:', error);
            this.showError('ultima-estrazione', 'Errore nel caricamento');
        }
    }

    displayUltimaEstrazione(data) {
        const container = document.getElementById('ultima-estrazione');
        if (!container) return;

        let html = `
            <div class="fade-in">
                <h6 class="text-muted mb-3">Concorso ${data.concorso} - ${data.data}</h6>
                <div class="row">
        `;

        // Mostra prime 5 ruote
        const ruoteTop = ['bari', 'milano', 'roma', 'torino', 'venezia'];
        ruoteTop.forEach(ruota => {
            if (data.numeri[ruota]) {
                html += `
                    <div class="col-12 mb-3">
                        <div class="ruota-container">
                            <div class="ruota-nome">${ruota.toUpperCase()}</div>
                            <div class="text-center">
                                ${data.numeri[ruota].map((num, idx) => 
                                    `<span class="numero-lotto ${idx === 0 ? 'gold' : idx === 1 ? 'silver' : ''}">${num}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        html += `
                </div>
                <div class="text-center mt-3">
                    <small class="text-muted">
                        <i class="fas fa-sync-alt"></i> Aggiornato automaticamente
                    </small>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    async generaNumeri() {
        const btnGenera = document.getElementById('genera-numeri');
        const tipoGiocata = document.getElementById('tipo-giocata').value;
        const ruotaScelta = document.getElementById('ruota-scelta').value;
        const risultatoContainer = document.getElementById('risultato-generatore');

        // Loading state
        btnGenera.disabled = true;
        btnGenera.innerHTML = '<span class="loading"></span> Generando...';

        try {
            const response = await fetch(`${this.baseURL}/api/genera/numeri?tipo=${tipoGiocata}&ruota=${ruotaScelta}`);
            const data = await response.json();
            
            setTimeout(() => {
                this.displayRisultatoGeneratore(data, risultatoContainer);
                btnGenera.disabled = false;
                btnGenera.innerHTML = '<i class="fas fa-magic"></i> Genera Combinazione';
            }, 1000); // Ritardo per effetto

        } catch (error) {
            console.error('Errore generazione numeri:', error);
            this.showError('risultato-generatore', 'Errore nella generazione');
            btnGenera.disabled = false;
            btnGenera.innerHTML = '<i class="fas fa-magic"></i> Genera Combinazione';
        }
    }

    displayRisultatoGeneratore(data, container) {
        const html = `
            <div class="alert alert-success fade-in">
                <div class="text-center">
                    <h5><i class="fas fa-star"></i> Combinazione Generata!</h5>
                    <div class="my-3">
                        ${data.numeri.map((num, idx) => 
                            `<span class="numero-lotto ${idx === 0 ? 'gold' : ''}">${num}</span>`
                        ).join('')}
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-4">
                            <strong>Tipo:</strong> ${data.tipo.toUpperCase()}
                        </div>
                        <div class="col-md-4">
                            <strong>Ruota:</strong> ${data.ruota.toUpperCase()}
                        </div>
                        <div class="col-md-4">
                            <strong>Probabilità:</strong> ${data.probabilita}
                        </div>
                    </div>
                    <small class="text-muted d-block mt-2">
                        Generato il ${data.generato}
                    </small>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    showError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> ${message}
                </div>
            `;
        }
    }

    // Utility per formattare numeri
    formatNumber(num) {
        return num.toString().padStart(2, '0');
    }

    // Utility per colori numeri in base alla frequenza
    getNumeroColor(numero, frequenza) {
        if (frequenza > 150) return 'gold';
        if (frequenza > 100) return 'silver';
        if (frequenza > 75) return 'bronze';
        return '';
    }
}

// Inizializza app quando DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
    window.lottoApp = new LottoAnalyzer();
    
    // Easter egg
    console.log(`
    🎲 Lotto Analyzer Dashboard
    ============================
    Build: Railway Production
    Version: 1.0.0
    Author: carosello75
    
    Comandi disponibili:
    - lottoApp.loadUltimaEstrazione()
    - lottoApp.generaNumeri()
    
    Buona fortuna! 🍀
    `);
});

// Service Worker per PWA (opzionale)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/static/js/sw.js')
            .then(function(registration) {
                console.log('SW registrato con successo:', registration.scope);
            })
            .catch(function(error) {
                console.log('SW registrazione fallita:', error);
            });
    });
}

// Utility globali
window.LottoUtils = {
    // Genera numero casuale tra min e max
    randomBetween: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Converte timestamp in data italiana
    formatDateItalian: (timestamp) => {
        return new Date(timestamp).toLocaleDateString('it-IT');
    },
    
    // Controlla se un numero è fortunato (superstizione)
    isLuckyNumber: (num) => [7, 13, 21, 77].includes(num)
};
