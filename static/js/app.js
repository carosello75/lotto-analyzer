// Lotto Analyzer JavaScript App - Updated with Tutte le Ruote

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
        console.log('🌍 Supporto TUTTE LE RUOTE attivato!');
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
            // Controlla se è selezionato "tutte le ruote"
            const ruotaSelect = document.getElementById('ruota-scelta');
            const isAllWheels = ruotaSelect && ruotaSelect.value === 'tutte';
            
            const endpoint = isAllWheels ? '/api/estrazioni/tutte-ruote' : '/api/estrazioni/ultima';
            const response = await fetch(`${this.baseURL}${endpoint}`);
            const data = await response.json();
            
            this.displayUltimaEstrazione(data, isAllWheels);
        } catch (error) {
            console.error('Errore caricamento estrazione:', error);
            this.showError('ultima-estrazione', 'Errore nel caricamento');
        }
    }

    displayUltimaEstrazione(data, isAllWheels = false) {
        const container = document.getElementById('ultima-estrazione');
        if (!container) return;

        let html = `
            <div class="fade-in">
                <h6 class="text-muted mb-3">
                    Concorso ${data.concorso} - ${data.data}
                    ${isAllWheels ? '<span class="badge bg-success ms-2">TUTTE LE RUOTE</span>' : ''}
                </h6>
        `;

        if (isAllWheels && data.statistiche_combinate) {
            // Mostra statistiche combinate
            html += `
                <div class="alert alert-info mb-3">
                    <h6><i class="fas fa-chart-bar"></i> Statistiche Combinate</h6>
                    <div class="row text-center">
                        <div class="col-4">
                            <strong>${data.statistiche_combinate.total_estrazioni}</strong><br>
                            <small>Numeri Totali</small>
                        </div>
                        <div class="col-4">
                            <strong>${data.statistiche_combinate.numeri_unici}</strong><br>
                            <small>Numeri Unici</small>
                        </div>
                        <div class="col-4">
                            <strong>${data.statistiche_combinate.media_uscite.toFixed(1)}</strong><br>
                            <small>Media Uscite</small>
                        </div>
                    </div>
                </div>
                
                <div class="alert alert-warning">
                    <h6><i class="fas fa-star"></i> Top Numeri Frequenti (Tutte le Ruote)</h6>
                    <div class="text-center">
                        ${data.statistiche_combinate.numeri_piu_frequenti.slice(0, 10).map(([num, freq]) => 
                            `<span class="numero-lotto gold me-1" title="Uscito ${freq} volte">${num}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }

        html += '<div class="row">';

        // Mostra prime 5 ruote
        const ruoteTop = ['bari', 'milano', 'roma', 'torino', 'venezia'];
        ruoteTop.forEach(ruota => {
            if (data.numeri[ruota]) {
                html += `
                    <div class="col-12 mb-3">
                        <div class="ruota-container">
                            <div class="ruota-nome">
                                ${ruota.toUpperCase()}
                                ${isAllWheels ? '<span class="badge bg-primary ms-2">Inclusa</span>' : ''}
                            </div>
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
                        <i class="fas fa-sync-alt"></i> 
                        ${isAllWheels ? 'Dati combinati di tutte le 10 ruote' : 'Aggiornato automaticamente'}
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
        const isAllWheels = data.ruota === 'tutte';
        const alertClass = isAllWheels ? 'alert-warning' : 'alert-success';
        
        const html = `
            <div class="alert ${alertClass} fade-in">
                <div class="text-center">
                    <h5>
                        <i class="fas fa-star"></i> Combinazione Generata!
                        ${isAllWheels ? '<span class="badge bg-success ms-2">TUTTE LE RUOTE</span>' : ''}
                    </h5>
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
                            <strong>Ruota:</strong> ${isAllWheels ? 'TUTTE LE RUOTE' : data.ruota.toUpperCase()}
                        </div>
                        <div class="col-md-4">
                            <strong>Probabilità:</strong> ${data.probabilita}
                        </div>
                    </div>
                    ${isAllWheels ? `
                        <div class="alert alert-info mt-3">
                            <i class="fas fa-info-circle"></i> ${data.note}
                        </div>
                    ` : ''}
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
    
    // Easter egg aggiornato
    console.log(`
    🎲 Lotto Analyzer Dashboard
    ============================
    Build: Railway Production
    Version: 1.1.0 - TUTTE LE RUOTE
    Author: carosello75
    
    🌍 NOVITÀ: Supporto TUTTE LE RUOTE!
    - Migliori probabilità
    - Statistiche combinate  
    - Dati di tutte le 10 ruote
    
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

// Utility globali aggiornate
window.LottoUtils = {
    // Genera numero casuale tra min e max
    randomBetween: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    
    // Converte timestamp in data italiana
    formatDateItalian: (timestamp) => {
        return new Date(timestamp).toLocaleDateString('it-IT');
    },
    
    // Controlla se un numero è fortunato (superstizione)
    isLuckyNumber: (num) => [7, 13, 21, 77].includes(num),
    
    // Nuova utility per tutte le ruote
    getAllWheelsStats: () => {
        console.log('🌍 Caricamento statistiche TUTTE LE RUOTE...');
        if (window.lottoApp) {
            return fetch(`${window.lottoApp.baseURL}/api/estrazioni/tutte-ruote`)
                .then(response => response.json());
        }
    }
};
