// Generator JavaScript - Lotto Analyzer

class GeneratorManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
    }

    setupEventListeners() {
        const generateBtn = document.getElementById('genera-combinazioni');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateCombinations();
            });
        }

        // Form change listeners for live updates
        const selects = ['tipo-giocata-gen', 'ruota-gioco', 'strategia', 'num-combinazioni'];
        selects.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateProbabilities();
                });
            }
        });
    }

    loadInitialData() {
        this.updateProbabilities();
    }

    async generateCombinations() {
        const tipo = document.getElementById('tipo-giocata-gen').value;
        const ruota = document.getElementById('ruota-gioco').value;
        const strategia = document.getElementById('strategia').value;
        const numCombinazioni = parseInt(document.getElementById('num-combinazioni').value);

        const generateBtn = document.getElementById('genera-combinazioni');
        const resultsContainer = document.getElementById('risultati-container');
        const combinazioniResults = document.getElementById('combinazioni-results');

        // Loading state
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-magic fa-spin"></i> Generando Magia...';
        
        try {
            const combinazioni = [];
            
            // Generate multiple combinations
            for (let i = 0; i < numCombinazioni; i++) {
                const response = await fetch(`/api/genera/numeri?tipo=${tipo}&ruota=${ruota}&strategia=${strategia}`);
                const data = await response.json();
                combinazioni.push({
                    ...data,
                    id: i + 1
                });
                
                // Small delay for effect
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            this.displayCombinations(combinazioni, combinazioniResults);
            resultsContainer.style.display = 'block';
            
            // Scroll to results
            resultsContainer.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Errore generazione:', error);
            this.showError('Errore nella generazione delle combinazioni');
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Genera Combinazioni Magiche';
        }
    }

    displayCombinations(combinazioni, container) {
        let html = '';

        combinazioni.forEach((combinazione, index) => {
            const cardColor = this.getCardColor(index);
            html += `
                <div class="col-lg-4 col-md-6 mb-4 fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="card shadow-sm border-${cardColor}">
                        <div class="card-header bg-${cardColor} text-white text-center">
                            <h6 class="mb-0">
                                <i class="fas fa-star"></i> Combinazione ${combinazione.id}
                            </h6>
                        </div>
                        <div class="card-body text-center">
                            <div class="mb-3">
                                ${combinazione.numeri.map((num, idx) => 
                                    `<span class="numero-lotto ${this.getNumeroClass(idx)} me-1">${num}</span>`
                                ).join('')}
                            </div>
                            <div class="row text-center">
                                <div class="col-6">
                                    <small class="text-muted">Tipo</small><br>
                                    <strong>${combinazione.tipo.toUpperCase()}</strong>
                                </div>
                                <div class="col-6">
                                    <small class="text-muted">Ruota</small><br>
                                    <strong>${combinazione.ruota.toUpperCase()}</strong>
                                </div>
                            </div>
                            <hr>
                            <div class="text-center">
                                <small class="text-muted">Probabilità</small><br>
                                <span class="badge bg-info">${combinazione.probabilita}</span>
                            </div>
                            <div class="mt-3">
                                <button class="btn btn-outline-primary btn-sm me-2" onclick="copyToClipboard('${combinazione.numeri.join('-')}')">
                                    <i class="fas fa-copy"></i> Copia
                                </button>
                                <button class="btn btn-outline-success btn-sm" onclick="favoriteCombination(${combinazione.id})">
                                    <i class="fas fa-heart"></i> Preferiti
                                </button>
                            </div>
                        </div>
                        <div class="card-footer text-center">
                            <small class="text-muted">
                                <i class="fas fa-clock"></i> ${combinazione.generato}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getCardColor(index) {
        const colors = ['primary', 'success', 'warning', 'info', 'secondary'];
        return colors[index % colors.length];
    }

    getNumeroClass(index) {
        switch(index) {
            case 0: return 'gold';
            case 1: return 'silver';  
            case 2: return 'bronze';
            default: return '';
        }
    }

    updateProbabilities() {
        const tipo = document.getElementById('tipo-giocata-gen').value;
        
        // Update probability info based on selection
        const probabilities = {
            'ambo': '1 su 4.005',
            'terno': '1 su 117.480', 
            'quaterna': '1 su 2.704.156',
            'cinquina': '1 su 43.949.268'
        };

        // Could update UI elements here to show current probability
        console.log(`Probabilità ${tipo}: ${probabilities[tipo]}`);
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'alert alert-danger position-fixed top-0 end-0 m-3';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// Global functions for buttons
function generateQuick(tipo, ruota) {
    // Set form values
    document.getElementById('tipo-giocata-gen').value = tipo;
    document.getElementById('ruota-gioco').value = ruota;
    document.getElementById('num-combinazioni').value = '1';
    
    // Generate immediately
    if (window.generatorManager) {
        window.generatorManager.generateCombinations();
    }
}

function generateLucky() {
    // Set to lucky configuration
    document.getElementById('tipo-giocata-gen').value = 'cinquina';
    document.getElementById('ruota-gioco').value = 'nazionale';
    document.getElementById('strategia').value = 'mista';
    document.getElementById('num-combinazioni').value = '3';
    
    if (window.generatorManager) {
        window.generatorManager.generateCombinations();
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'alert alert-success position-fixed top-0 end-0 m-3';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            Numeri copiati: ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 2000);
    });
}

function favoriteCombination(id) {
    // Add to favorites (could be implemented with localStorage)
    console.log(`Combinazione ${id} aggiunta ai preferiti!`);
    
    const toast = document.createElement('div');
    toast.className = 'alert alert-info position-fixed top-0 end-0 m-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        ❤️ Combinazione ${id} aggiunta ai preferiti!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 2000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.generatorManager = new GeneratorManager();
});
