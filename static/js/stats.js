// Statistics JavaScript - Lotto Analyzer

class StatsManager {
    constructor() {
        this.charts = {};
        this.currentData = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initCharts();
        this.loadStatsData();
        this.generateHeatmap();
    }

    setupEventListeners() {
        const updateBtn = document.getElementById('aggiorna-stats');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                this.updateStats();
            });
        }

        // Filter change listeners
        ['tipo-analisi', 'ruota-stats', 'periodo-stats'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateStats();
                });
            }
        });
    }

    async loadStatsData() {
        try {
            // Load frequenze and ritardi
            const [freqResponse, ritardiResponse] = await Promise.all([
                fetch('/api/stats/frequenze'),
                fetch('/api/stats/ritardi')
            ]);

            const frequenze = await freqResponse.json();
            const ritardi = await ritardiResponse.json();

            this.currentData = { frequenze: frequenze.frequenze, ritardi: ritardi.ritardi };
            
            this.updateMainChart();
            this.updateTopNumbers();
            this.updateStatsTable();
            this.updateRitardiDettaglio();
            
        } catch (error) {
            console.error('Errore caricamento statistiche:', error);
        }
    }

    initCharts() {
        this.initMainStatsChart();
    }

    initMainStatsChart() {
        const ctx = document.getElementById('mainStatsChart');
        if (!ctx) return;

        this.charts.mainStats = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Valore',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Numero ${context.label}: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    updateMainChart() {
        if (!this.charts.mainStats || !this.currentData.frequenze) return;

        const tipo = document.getElementById('tipo-analisi').value;
        const data = tipo === 'frequenze' ? this.currentData.frequenze : this.currentData.ritardi;

        // Get top 30 for better visualization
        const sortedData = Object.entries(data)
            .sort(([,a], [,b]) => tipo === 'frequenze' ? b - a : b - a)
            .slice(0, 30);

        const labels = sortedData.map(([num]) => num);
        const values = sortedData.map(([,val]) => val);
        const colors = this.generateColors(values, tipo);

        this.charts.mainStats.data.labels = labels;
        this.charts.mainStats.data.datasets[0].data = values;
        this.charts.mainStats.data.datasets[0].backgroundColor = colors.background;
        this.charts.mainStats.data.datasets[0].borderColor = colors.border;
        this.charts.mainStats.data.datasets[0].label = tipo === 'frequenze' ? 'Frequenza' : 'Ritardo';

        // Update chart title
        const chartTitle = document.getElementById('chart-title');
        if (chartTitle) {
            chartTitle.textContent = tipo === 'frequenze' ? 'Frequenze Numeri' : 'Ritardi Numeri';
        }

        this.charts.mainStats.update();
    }

    generateColors(values, tipo) {
        const colors = {
            background: [],
            border: []
        };

        values.forEach(value => {
            if (tipo === 'frequenze') {
                if (value > 150) {
                    colors.background.push('rgba(255, 99, 132, 0.8)'); // Red for high frequency
                    colors.border.push('rgba(255, 99, 132, 1)');
                } else if (value > 100) {
                    colors.background.push('rgba(255, 206, 86, 0.8)'); // Yellow for medium
                    colors.border.push('rgba(255, 206, 86, 1)');
                } else {
                    colors.background.push('rgba(54, 162, 235, 0.8)'); // Blue for low
                    colors.border.push('rgba(54, 162, 235, 1)');
                }
            } else {
                if (value > 80) {
                    colors.background.push('rgba(255, 99, 132, 0.8)'); // Red for high delay
                    colors.border.push('rgba(255, 99, 132, 1)');
                } else if (value > 50) {
                    colors.background.push('rgba(255, 159, 64, 0.8)'); // Orange for medium
                    colors.border.push('rgba(255, 159, 64, 1)');
                } else {
                    colors.background.push('rgba(75, 192, 192, 0.8)'); // Teal for low
                    colors.border.push('rgba(75, 192, 192, 1)');
                }
            }
        });

        return colors;
    }

    updateTopNumbers() {
        const container = document.getElementById('top-numbers-list');
        if (!container || !this.currentData.frequenze) return;

        const tipo = document.getElementById('tipo-analisi').value;
        const data = tipo === 'frequenze' ? this.currentData.frequenze : this.currentData.ritardi;

        const sortedData = Object.entries(data)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        let html = '';
        sortedData.forEach(([numero, valore], index) => {
            const badgeClass = this.getBadgeClass(index);
            const iconClass = this.getIconClass(index);
            
            html += `
                <div class="d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
                    <div class="d-flex align-items-center">
                        <i class="fas ${iconClass} me-2"></i>
                        <span class="numero-lotto me-2">${numero}</span>
                    </div>
                    <span class="badge ${badgeClass}">${valore}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getBadgeClass(index) {
        const classes = ['bg-warning', 'bg-info', 'bg-success', 'bg-primary', 'bg-secondary'];
        return classes[Math.min(index, classes.length - 1)];
    }

    getIconClass(index) {
        const icons = ['fa-crown', 'fa-medal', 'fa-trophy', 'fa-star', 'fa-heart'];
        return icons[Math.min(index, icons.length - 1)];
    }

    generateHeatmap() {
        const container = document.getElementById('heatmap-container');
        if (!container) return;

        let html = '<div class="heatmap-grid">';
        
        // Create 9x10 grid for numbers 1-90
        for (let i = 1; i <= 90; i++) {
            const intensity = Math.random();
            const colorClass = this.getHeatmapColor(intensity);
            
            html += `
                <div class="heatmap-cell ${colorClass}" title="Numero ${i}">
                    ${i}
                </div>
            `;
        }
        
        html += '</div>';
        
        // Add CSS for heatmap
        const style = `
            <style>
                .heatmap-grid {
                    display: grid;
                    grid-template-columns: repeat(10, 1fr);
                    gap: 2px;
                }
                .heatmap-cell {
                    aspect-ratio: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.8rem;
                    font-weight: bold;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .heatmap-cell:hover {
                    transform: scale(1.1);
                    z-index: 10;
                }
                .heat-low { background-color: #e3f2fd; color: #1976d2; }
                .heat-medium { background-color: #fff3e0; color: #f57c00; }
                .heat-high { background-color: #ffebee; color: #d32f2f; }
                .heat-very-high { background-color: #f3e5f5; color: #7b1fa2; }
            </style>
        `;
        
        container.innerHTML = style + html;
    }

    getHeatmapColor(intensity) {
        if (intensity < 0.25) return 'heat-low';
        if (intensity < 0.5) return 'heat-medium';
        if (intensity < 0.75) return 'heat-high';
        return 'heat-very-high';
    }

    updateStatsTable() {
        const tbody = document.getElementById('stats-table-body');
        if (!tbody || !this.currentData.frequenze) return;

        // Combine frequenze and ritardi data
        const numeri = Object.keys(this.currentData.frequenze);
        
        let html = '';
        numeri.slice(0, 20).forEach(numero => {
            const frequenza = this.currentData.frequenze[numero];
            const ritardo = this.currentData.ritardi[numero];
            const trend = this.calculateTrend(frequenza, ritardo);
            
            html += `
                <tr>
                    <td><span class="numero-lotto">${numero}</span></td>
                    <td><span class="badge bg-primary">${frequenza}</span></td>
                    <td><span class="badge bg-warning">${ritardo}</span></td>
                    <td>${Math.floor(ritardo * 1.2)}</td>
                    <td>${this.getRandomDate()}</td>
                    <td>${trend}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    calculateTrend(frequenza, ritardo) {
        const score = frequenza - ritardo;
        if (score > 50) return '<i class="fas fa-arrow-up text-success"></i> Crescita';
        if (score < -50) return '<i class="fas fa-arrow-down text-danger"></i> Calo';
        return '<i class="fas fa-minus text-muted"></i> Stabile';
    }

    getRandomDate() {
        const days = Math.floor(Math.random() * 30) + 1;
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toLocaleDateString('it-IT');
    }

    updateRitardiDettaglio() {
        const container = document.getElementById('ritardi-dettaglio');
        if (!container || !this.currentData.ritardi) return;

        const sortedRitardi = Object.entries(this.currentData.ritardi)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 15);

        let html = '';
        sortedRitardi.forEach(([numero, ritardo]) => {
            const alertClass = this.getRitardoAlertClass(ritardo);
            
            html += `
                <div class="alert ${alertClass} py-2 mb-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="numero-lotto me-2">${numero}</span>
                            <strong>${ritardo}</strong> estrazioni
                        </div>
                        <div>
                            ${this.getRitardoIcon(ritardo)}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    getRitardoAlertClass(ritardo) {
        if (ritardo > 100) return 'alert-danger';
        if (ritardo > 70) return 'alert-warning';
        if (ritardo > 40) return 'alert-info';
        return 'alert-success';
    }

    getRitardoIcon(ritardo) {
        if (ritardo > 100) return '<i class="fas fa-fire text-danger"></i>';
        if (ritardo > 70) return '<i class="fas fa-exclamation-triangle text-warning"></i>';
        if (ritardo > 40) return '<i class="fas fa-clock text-info"></i>';
        return '<i class="fas fa-check text-success"></i>';
    }

    async updateStats() {
        const updateBtn = document.getElementById('aggiorna-stats');
        if (updateBtn) {
            updateBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Aggiornando...';
            updateBtn.disabled = true;
        }

        try {
            await this.loadStatsData();
            this.showMessage('Statistiche aggiornate!', 'success');
        } catch (error) {
            this.showMessage('Errore aggiornamento statistiche', 'danger');
        } finally {
            if (updateBtn) {
                updateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Aggiorna';
                updateBtn.disabled = false;
            }
        }
    }

    showMessage(message, type) {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.statsManager = new StatsManager();
});
