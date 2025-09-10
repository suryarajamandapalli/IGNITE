/**
 * QUANTUM JOBS TRACKER - MAIN APPLICATION
 * Team IGNITE - Championship Edition
 * 
 * Main application controller with quantum-themed interactions
 */

class QuantumJobsTracker {
  constructor() {
    this.currentTab = 'dashboard';
    this.isLoading = false;
    this.refreshInterval = null;
    this.notifications = [];
    
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Quantum Jobs Tracker...');
    
    // Show loading screen
    this.showLoadingScreen();
    
    // Initialize components
    await this.initializeApp();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start data refresh cycle
    this.startDataRefresh();
    
    // Hide loading screen and show app
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 3000);
  }

  async initializeApp() {
    try {
      // Initialize quantum API
      if (window.QuantumAPI) {
        await window.QuantumAPI.initialize();
      }
      
      // Wait a bit for external libraries to load
      await this.delay(500);
      
      // Initialize charts (with fallback)
      try {
        if (window.QuantumCharts) {
          window.QuantumCharts.init();
        }
      } catch (error) {
        console.log('⚠️ Charts initialization failed - continuing without charts');
      }
      
      // Initialize dashboard
      if (window.QuantumDashboard) {
        await window.QuantumDashboard.init();
      }
      
      console.log('✅ All components initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      this.showNotification('Application initialized with limited functionality', 'warning');
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    
    if (!loadingScreen || !loadingText) return;

    const messages = [
      'Connecting to IBM Quantum Network...',
      'Establishing quantum entanglement...',
      'Calibrating quantum circuits...',
      'Synchronizing with quantum backends...',
      'Loading quantum job data...',
      'Initializing dashboard interface...',
      'Ready for quantum computing!'
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        loadingText.textContent = messages[messageIndex];
        messageIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 400);
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('main-app');
    
    if (loadingScreen && mainApp) {
      loadingScreen.classList.add('hidden');
      mainApp.classList.remove('hidden');
      
      // Add welcome notification
      setTimeout(() => {
        this.showNotification('Welcome to Quantum Jobs Tracker! 🚀', 'success');
      }, 500);
    }
  }

  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.currentTarget.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Refresh button
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.refreshData();
      });
    }

    // Theme toggle
    const themeToggle = document.getElementById('toggle-theme');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Notifications
    const notificationsBtn = document.getElementById('notifications');
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', () => {
        this.showNotificationsPanel();
      });
    }

    // Job search
    const jobSearch = document.getElementById('job-search');
    if (jobSearch) {
      jobSearch.addEventListener('input', (e) => {
        this.filterJobs(e.target.value);
      });
    }

    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('click', () => {
        this.toggleStatusFilter();
      });
    }

    // Pagination
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');
    
    if (prevPage) {
      prevPage.addEventListener('click', () => {
        this.previousPage();
      });
    }
    
    if (nextPage) {
      nextPage.addEventListener('click', () => {
        this.nextPage();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  switchTab(tabName) {
    if (this.currentTab === tabName) return;

    // Remove active class from current tab and content
    document.querySelector('.nav-tab.active')?.classList.remove('active');
    document.querySelector('.tab-content.active')?.classList.remove('active');

    // Add active class to new tab and content
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`${tabName}-tab`)?.classList.add('active');

    this.currentTab = tabName;

    // Load tab-specific data
    this.loadTabData(tabName);

    // Add quantum flicker effect
    const activeTab = document.querySelector('.nav-tab.active');
    if (activeTab) {
      activeTab.classList.add('quantum-flicker');
      setTimeout(() => {
        activeTab.classList.remove('quantum-flicker');
      }, 500);
    }

    console.log(`📱 Switched to ${tabName} tab`);
  }

  async loadTabData(tabName) {
    try {
      switch (tabName) {
        case 'dashboard':
          await this.loadDashboardData();
          break;
        case 'jobs':
          await this.loadJobsData();
          break;
        case 'analytics':
          await this.loadAnalyticsData();
          break;
        case 'machines':
          await this.loadMachinesData();
          break;
      }
    } catch (error) {
      console.error(`Error loading ${tabName} data:`, error);
      this.showNotification(`Failed to load ${tabName} data`, 'error');
    }
  }

  async loadDashboardData() {
    if (window.QuantumDashboard) {
      await window.QuantumDashboard.refreshStats();
      await window.QuantumDashboard.refreshCharts();
      await window.QuantumDashboard.refreshActivity();
    }
  }

  async loadJobsData() {
    if (window.QuantumAPI) {
      const jobs = await window.QuantumAPI.getJobs();
      this.populateJobsTable(jobs);
    }
  }

  async loadAnalyticsData() {
    if (window.QuantumCharts) {
      await window.QuantumCharts.refreshAnalyticsCharts();
    }
  }

  async loadMachinesData() {
    if (window.QuantumAPI) {
      const machines = await window.QuantumAPI.getMachines();
      this.populateMachinesGrid(machines);
    }
  }

  populateJobsTable(jobs) {
    const tbody = document.getElementById('jobs-table-body');
    if (!tbody || !jobs) return;

    tbody.innerHTML = '';

    jobs.forEach(job => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><span class="job-id">${job.id}</span></td>
        <td><span class="status-badge ${job.status}">${job.status}</span></td>
        <td><span class="backend-chip">${job.backend}</span></td>
        <td>${job.circuits}</td>
        <td>${job.shots.toLocaleString()}</td>
        <td>${this.formatDate(job.created)}</td>
        <td>${job.duration || '-'}</td>
        <td class="job-actions">
          <button class="action-btn" title="View Details" onclick="app.viewJobDetails('${job.id}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn" title="Download Results" onclick="app.downloadResults('${job.id}')">
            <i class="fas fa-download"></i>
          </button>
          <button class="action-btn" title="Cancel Job" onclick="app.cancelJob('${job.id}')" 
                  ${job.status === 'completed' || job.status === 'failed' ? 'disabled' : ''}>
            <i class="fas fa-times"></i>
          </button>
        </td>
      `;
      
      // Add quantum flicker animation on row creation
      row.classList.add('quantum-flicker');
      setTimeout(() => {
        row.classList.remove('quantum-flicker');
      }, 300);
      
      tbody.appendChild(row);
    });

    // Update jobs count
    const totalJobs = document.getElementById('total-jobs');
    if (totalJobs) {
      totalJobs.textContent = jobs.length;
    }
  }

  populateMachinesGrid(machines) {
    const grid = document.getElementById('machines-grid');
    if (!grid || !machines) return;

    grid.innerHTML = '';

    machines.forEach((machine, index) => {
      const card = document.createElement('div');
      card.className = 'machine-card float-animation';
      card.style.animationDelay = `${index * 0.1}s`;
      
      card.innerHTML = `
        <div class="machine-header">
          <div class="machine-name">${machine.name}</div>
          <div class="machine-location">${machine.location}</div>
        </div>
        <div class="machine-body">
          <div class="machine-stats">
            <div class="machine-stat">
              <div class="machine-stat-value">${machine.qubits}</div>
              <div class="machine-stat-label">Qubits</div>
            </div>
            <div class="machine-stat">
              <div class="machine-stat-value">${machine.pending}</div>
              <div class="machine-stat-label">Queue</div>
            </div>
            <div class="machine-stat">
              <div class="machine-stat-value">${machine.fidelity}%</div>
              <div class="machine-stat-label">Fidelity</div>
            </div>
            <div class="machine-stat">
              <div class="machine-stat-value">${machine.uptime}%</div>
              <div class="machine-stat-label">Uptime</div>
            </div>
          </div>
          <div class="machine-status ${machine.status}">
            <i class="fas fa-circle"></i>
            ${machine.status.charAt(0).toUpperCase() + machine.status.slice(1)}
          </div>
        </div>
      `;
      
      grid.appendChild(card);
    });
  }

  async refreshData() {
    if (this.isLoading) return;

    this.isLoading = true;
    const refreshBtn = document.getElementById('refresh-data');
    
    if (refreshBtn) {
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
      refreshBtn.disabled = true;
    }

    try {
      await this.loadTabData(this.currentTab);
      this.showNotification('Data refreshed successfully', 'success');
    } catch (error) {
      console.error('Error refreshing data:', error);
      this.showNotification('Failed to refresh data', 'error');
    } finally {
      this.isLoading = false;
      
      if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        refreshBtn.disabled = false;
      }
    }
  }

  startDataRefresh() {
    // Refresh data every 30 seconds
    this.refreshInterval = setInterval(() => {
      if (!this.isLoading) {
        this.refreshData();
      }
    }, 30000);
  }

  stopDataRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  filterJobs(searchTerm) {
    const rows = document.querySelectorAll('#jobs-table-body tr');
    const term = searchTerm.toLowerCase();

    rows.forEach(row => {
      const jobId = row.querySelector('.job-id')?.textContent.toLowerCase() || '';
      const backend = row.querySelector('.backend-chip')?.textContent.toLowerCase() || '';
      const status = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';

      const matches = jobId.includes(term) || backend.includes(term) || status.includes(term);
      row.style.display = matches ? '' : 'none';
    });
  }

  toggleStatusFilter() {
    const dropdown = document.querySelector('.dropdown-menu');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  toggleTheme() {
    // This would implement dark/light theme toggle
    // For now, we'll just show a notification
    this.showNotification('Theme toggle coming soon!', 'info');
  }

  showNotificationsPanel() {
    // Show notifications panel (simplified for demo)
    this.showNotification('You have 3 new job completions', 'info');
  }

  previousPage() {
    // Implement pagination logic
    console.log('Previous page');
  }

  nextPage() {
    // Implement pagination logic
    console.log('Next page');
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + R: Refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      this.refreshData();
    }
    
    // Number keys for tab switching
    if (e.key >= '1' && e.key <= '4') {
      const tabs = ['dashboard', 'jobs', 'analytics', 'machines'];
      const tabIndex = parseInt(e.key) - 1;
      if (tabs[tabIndex]) {
        this.switchTab(tabs[tabIndex]);
      }
    }
  }

  handleResize() {
    // Trigger chart resize if needed
    if (window.QuantumCharts) {
      window.QuantumCharts.handleResize();
    }
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const toastId = Date.now();
    toast.innerHTML = `
      <div class="toast-header">
        <div class="toast-title">${this.getNotificationTitle(type)}</div>
        <button class="toast-close" onclick="app.closeNotification(${toastId})">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="toast-body">${message}</div>
    `;
    
    toast.id = `toast-${toastId}`;
    container.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.closeNotification(toastId);
    }, 5000);

    this.notifications.push({ id: toastId, message, type });
  }

  closeNotification(toastId) {
    const toast = document.getElementById(`toast-${toastId}`);
    if (toast) {
      toast.classList.remove('show');
      toast.classList.add('slide-out-right');
      
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
    
    // Remove from notifications array
    this.notifications = this.notifications.filter(n => n.id !== toastId);
  }

  getNotificationTitle(type) {
    const titles = {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Information'
    };
    return titles[type] || 'Notification';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    }
    
    // Less than 1 day
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    }
    
    // More than 1 day
    return date.toLocaleDateString();
  }

  // Public API methods for HTML onclick handlers
  viewJobDetails(jobId) {
    this.showNotification(`Viewing details for job ${jobId}`, 'info');
  }

  downloadResults(jobId) {
    this.showNotification(`Downloading results for job ${jobId}`, 'info');
  }

  cancelJob(jobId) {
    this.showNotification(`Cancelling job ${jobId}`, 'warning');
  }

  // Cleanup on page unload
  cleanup() {
    this.stopDataRefresh();
    console.log('🧹 Quantum Jobs Tracker cleaned up');
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new QuantumJobsTracker();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.app) {
    window.app.cleanup();
  }
});

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  if (window.app) {
    window.app.showNotification('An unexpected error occurred', 'error');
  }
});

console.log('⚛️ Quantum Jobs Tracker loaded and ready!');