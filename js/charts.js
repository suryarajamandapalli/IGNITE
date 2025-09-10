/**
 * QUANTUM CHARTS & VISUALIZATIONS
 * Team IGNITE - Championship Edition
 * 
 * Advanced charting system with stunning visualizations
 */

class QuantumCharts {
  constructor() {
    this.charts = {};
    this.chartColors = {
      primary: '#3B82F6',
      secondary: '#6366F1',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4',
      purple: '#8B5CF6',
      pink: '#EC4899'
    };
    
    this.gradients = {};
    this.isInitialized = false;
  }

  init() {
    console.log('📊 Initializing Quantum Charts...');
    
    // Wait for Chart.js to be available
    if (typeof Chart === 'undefined') {
      console.log('⏳ Waiting for Chart.js to load...');
      setTimeout(() => this.init(), 100);
      return;
    }
    
    // Set Chart.js defaults
    this.setChartDefaults();
    
    // Initialize charts
    this.initStatusChart();
    this.initTimelineChart();
    this.initUtilizationChart();
    this.initSuccessChart();
    
    this.isInitialized = true;
    console.log('✅ Quantum Charts initialized');
  }

  setChartDefaults() {
    Chart.defaults.font.family = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#64748B';
    Chart.defaults.plugins.legend.display = true;
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 20;
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.interaction.intersect = false;
    Chart.defaults.interaction.mode = 'index';
    
    // Animation settings
    Chart.defaults.animation.duration = 750;
    Chart.defaults.animation.easing = 'easeInOutQuart';
  }

  createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  }

  initStatusChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Create gradients
    const runningGradient = this.createGradient(ctx, 'rgba(16, 185, 129, 0.8)', 'rgba(16, 185, 129, 0.1)');
    const queuedGradient = this.createGradient(ctx, 'rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.1)');
    const completedGradient = this.createGradient(ctx, 'rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.1)');
    const failedGradient = this.createGradient(ctx, 'rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.1)');

    this.charts.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Running', 'Queued', 'Completed', 'Failed'],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: [
            runningGradient,
            queuedGradient,
            completedGradient,
            failedGradient
          ],
          borderColor: [
            this.chartColors.success,
            this.chartColors.warning,
            this.chartColors.primary,
            this.chartColors.error
          ],
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              font: {
                size: 11,
                weight: '500'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeInOutCubic'
        }
      }
    });
  }

  initTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Generate time labels for last 24 hours
    const timeLabels = this.generateTimeLabels(24);
    
    const gradient = this.createGradient(ctx, 'rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.05)');

    this.charts.timelineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [{
          label: 'Jobs Submitted',
          data: this.generateTimelineData(24),
          borderColor: this.chartColors.primary,
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: this.chartColors.primary,
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                size: 10
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(148, 163, 184, 0.1)'
            },
            border: {
              display: false
            },
            ticks: {
              font: {
                size: 10
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            displayColors: false
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  initUtilizationChart() {
    const canvas = document.getElementById('utilizationChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    this.charts.utilizationChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Queue Length',
          data: [],
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: this.chartColors.primary,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }, {
          label: 'Utilization %',
          data: [],
          type: 'line',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: this.chartColors.success,
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: this.chartColors.success,
          pointBorderWidth: 2,
          pointRadius: 4,
          yAxisID: 'y1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              maxRotation: 45,
              font: {
                size: 10
              }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Queue Length',
              font: {
                size: 11,
                weight: '600'
              }
            },
            grid: {
              color: 'rgba(148, 163, 184, 0.1)'
            },
            border: {
              display: false
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Utilization %',
              font: {
                size: 11,
                weight: '600'
              }
            },
            grid: {
              drawOnChartArea: false
            },
            border: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 11,
                weight: '500'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        }
      }
    });
  }

  initSuccessChart() {
    const canvas = document.getElementById('successChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    this.charts.successChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Successful', 'Failed'],
        datasets: [{
          data: [0, 0],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(239, 68, 68, 0.8)'
          ],
          borderColor: [
            this.chartColors.success,
            this.chartColors.error
          ],
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 11,
                weight: '500'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                return `${label}: ${percentage}%`;
              }
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12
          }
        },
        animation: {
          animateRotate: true,
          duration: 1000,
          easing: 'easeInOutCubic'
        }
      }
    });
  }

  async updateStatusChart(stats) {
    if (!this.charts.statusChart || !stats) return;

    const data = [
      stats.runningJobs || 0,
      stats.queuedJobs || 0,
      stats.completedJobs || 0,
      stats.failedJobs || 0
    ];

    this.charts.statusChart.data.datasets[0].data = data;
    this.charts.statusChart.update('active');
  }

  async updateTimelineChart() {
    if (!this.charts.timelineChart) return;

    const newData = this.generateTimelineData(24);
    this.charts.timelineChart.data.datasets[0].data = newData;
    this.charts.timelineChart.update('active');
  }

  async updateUtilizationChart(machines) {
    if (!this.charts.utilizationChart || !machines) return;

    const labels = machines.map(m => m.name.replace('ibm_', '').replace('ibmq_', ''));
    const queueData = machines.map(m => m.pending || 0);
    const utilizationData = machines.map(m => Math.min(100, (m.pending || 0) / (m.qubits || 1) * 100));

    this.charts.utilizationChart.data.labels = labels;
    this.charts.utilizationChart.data.datasets[0].data = queueData;
    this.charts.utilizationChart.data.datasets[1].data = utilizationData;
    this.charts.utilizationChart.update('active');
  }

  async updateSuccessChart(stats) {
    if (!this.charts.successChart || !stats) return;

    const successful = stats.completedJobs || 0;
    const failed = stats.failedJobs || 0;
    const total = successful + failed;

    if (total > 0) {
      this.charts.successChart.data.datasets[0].data = [successful, failed];
      this.charts.successChart.update('active');
    }
  }

  async refreshAnalyticsCharts() {
    if (!window.QuantumAPI) return;

    try {
      const [stats, machines] = await Promise.all([
        window.QuantumAPI.getStats(),
        window.QuantumAPI.getMachines()
      ]);

      await Promise.all([
        this.updateUtilizationChart(machines),
        this.updateSuccessChart(stats)
      ]);

    } catch (error) {
      console.error('Error refreshing analytics charts:', error);
    }
  }

  generateTimeLabels(hours) {
    const labels = [];
    const now = new Date();
    
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
      labels.push(time.getHours().toString().padStart(2, '0') + ':00');
    }
    
    return labels;
  }

  generateTimelineData(hours) {
    const data = [];
    
    for (let i = 0; i < hours; i++) {
      // Simulate more activity during business hours (9-17)
      const hour = (new Date().getHours() - (hours - 1 - i) + 24) % 24;
      let baseValue = 2;
      
      if (hour >= 9 && hour <= 17) {
        baseValue = 8;
      } else if (hour >= 18 && hour <= 22) {
        baseValue = 5;
      }
      
      const randomVariation = Math.random() * 6 - 3; // -3 to +3
      data.push(Math.max(0, Math.round(baseValue + randomVariation)));
    }
    
    return data;
  }

  handleResize() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.resize === 'function') {
        chart.resize();
      }
    });
  }

  destroyCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    this.charts = {};
  }

  // Animation helpers
  animateValue(obj, start, end, duration, callback) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      callback(value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // Quantum-themed chart animations
  addQuantumGlowEffect(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
      canvas.classList.add('glow-effect');
      setTimeout(() => {
        canvas.classList.remove('glow-effect');
      }, 2000);
    }
  }

  triggerQuantumUpdate(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
      canvas.classList.add('quantum-flicker');
      setTimeout(() => {
        canvas.classList.remove('quantum-flicker');
      }, 500);
    }
  }
}

// Create global instance
window.QuantumCharts = new QuantumCharts();

// Listen for quantum data updates
window.addEventListener('quantumDataUpdated', (event) => {
  const { stats, machines } = event.detail;
  
  if (window.QuantumCharts.isInitialized) {
    window.QuantumCharts.updateStatusChart(stats);
    window.QuantumCharts.updateTimelineChart();
    
    if (machines) {
      window.QuantumCharts.updateUtilizationChart(machines);
    }
    
    window.QuantumCharts.updateSuccessChart(stats);
  }
});

console.log('📊 Quantum Charts system loaded');