// Dashboard JavaScript - Lotto Analyzer

class DashboardManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.setupEventListeners();
        this.initCharts();
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshAllData();
            });
        }
    }

    async loadDashboardData() {
        try {
            // Load ultima estrazione
            await this.loadUltimaEstrazione();
            
            // Load frequenze for chart
            await this.loadFrequenze();
            
            // Load ritardi
            await this.loadRitardi();
            
            // Update stats
            this.updateStats();
            
        } catch (error) {
            console.error('Errore caricamento dashboard:', error);
        }
    }

    async loadUltimaEstrazione() {
        try {
            const response = await fetch('/api/estrazioni/ultima');
            const data = await response.json();
            this.displayTutteRuote(data);
        } catch (error) {
            console.error('Errore caricamento estrazione:', error);
        }
    }

    displayTutteRuote(data) {
        const container = document.getElementById('tutte-ruote');
        if (!container) return;

        let html = '';
        const ruote = Object.keys(data.numeri);

        ruote.forEach(ruota => {
            html += `
                <div class="col-lg-6 col-xl-4 mb-3">
                    <div class="ruota-container">
                        <div class="ruota-nome">${ruota.toUpperCase()}</div>
                        <div class="text-center">
                            ${data.numeri[ruota].map((num, idx) => 
                                `<span class="numero-lotto ${this.getNumeroClass(idx)}">${num}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getNumeroClass(index) {
        switch(index) {
            case 0: return 'gold';
            case 1: return 'silver';
            case 2: return 'bronze';
            default: return '';
        }
    }

    async loadFrequenze() {
        try {
            const response = await fetch('/api/stats/frequenze');
            const data = await response.json();
            this.updateFrequencyChart(data.frequenze);
        } catch (error) {
            console.error('Errore caricamento frequenze:', error);
        }
    }

    async loadRitardi() {
        try {
            const response = await fetch('/api/stats/ritardi');
            const data = await response.json();
            this.displayRitardi(data.ritardi);
        } catch (error) {
            console.error('Errore caricamento ritardi:', error);
        }
    }

    displayRitardi(ritardi) {
        const container = document.getElementById('ritardi-list');
        if (!container) return;

        // Get top 10 ritardi
        const sortedRitardi = Object.entries(ritardi)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        let html = '';
        sortedRitardi.forEach(([numero, ritardo], index) => {
            const colorClass = this.getRitardoColor(ritardo);
            html += `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <span class="numero-lotto ${colorClass}">${numero}</span>
                    <div class="text-end">
                        <strong>${ritardo}</strong> <small class="text-muted">estrazioni</small>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getRitardoColor(ritardo) {
        if (ritardo > 100) return 'bg-danger text-white';
        if (ritardo > 70) return 'bg-warning text-dark';
        if (ritardo > 40) return 'bg-info text-white';
        return '';
    }

    initCharts() {
        this.initFrequencyChart();
        this.initTrendChart();
    }

    initFrequencyChart() {
        const ctx = document.getElementById('frequencyChart');
        if (!ctx) return;

        this.charts.frequency = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Frequenza',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frequenza'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Numeri'
                        }
                    }
                }
            }
        });
    }

    initTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        // Generate sample trend data
        const labels = [];
        const data = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }));
            data.push(Math.floor(Math.random() * 50) + 50);
        }

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Estrazioni Settimanali',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Numero Estrazioni'
                        }
                    }
                }
            }
        });
    }

    updateFrequencyChart(frequenze) {
        if (!this.charts.frequency) return;

        // Get top 20 most frequent numbers
        const sortedFreq = Object.entries(frequenze)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20);

        const labels = sortedFreq.map(([num]) => num);
        const data = sortedFreq.map(([,freq]) => freq);

        this.charts.frequency.data.labels = labels;
        this.charts.frequency.data.datasets[0].data = data;
        this.charts.frequency.update();
    }

    updateStats() {
        // Update stat cards with random data for demo
        const stats = {
            'total-concorsi': Math.floor(Math.random() * 100) + 1200,
            'ultima-data': new Date().toLocaleDateString('it-IT'),
            'numero-top': Math.floor(Math.random() * 90) + 1,
            'numero-ritardo': Math.floor(Math.random() * 90) + 1
        };

        Object.entries(stats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }

    async refreshAllData() {
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Aggiornando...';
            refreshBtn.disabled = true;
        }

        try {
            await this.loadDashboardData();
            
            // Show success message
            this.showMessage('Dati aggiornati con successo!', 'success');
            
        } catch (error) {
            this.showMessage('Errore durante l\'aggiornamento', 'danger');
        } finally {
            if (refreshBtn) {
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Aggiorna';
                refreshBtn.disabled = false;
            }
        }
    }

    showMessage(message, type) {
        // Create and show toast notification
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboardManager = new DashboardManager();
});
