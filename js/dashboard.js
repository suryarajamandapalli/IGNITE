/**
 * QUANTUM DASHBOARD CONTROLLER
 * Team IGNITE - Championship Edition
 * 
 * Dashboard-specific functionality and real-time updates
 */

class QuantumDashboard {
  constructor() {
    this.updateInterval = null;
    this.activityBuffer = [];
    this.maxActivityItems = 20;
    this.isInitialized = false;
  }

  async init() {
    console.log('🎛️ Initializing Quantum Dashboard...');
    
    try {
      // Initialize components
      await this.setupRealTimeUpdates();
      await this.refreshStats();
      await this.refreshCharts();
      await this.refreshActivity();
      
      this.isInitialized = true;
      console.log('✅ Dashboard initialized successfully');
    } catch (error) {
      console.error('❌ Dashboard initialization failed:', error);
      throw error;
    }
  }

  setupRealTimeUpdates() {
    // Listen for quantum data updates
    window.addEventListener('quantumDataUpdated', (event) => {
      if (this.isInitialized) {
        this.handleRealTimeUpdate(event.detail);
      }
    });

    // Set up periodic updates
    this.updateInterval = setInterval(() => {
      this.periodicUpdate();
    }, 10000); // Update every 10 seconds
  }

  async handleRealTimeUpdate(data) {
    const { stats, jobs } = data;
    
    // Update stats with animations
    this.animateStatUpdates(stats);
    
    // Add new jobs to activity feed
    if (jobs && jobs.length > 0) {
      this.addNewJobsToActivity(jobs);
    }
  }

  async refreshStats() {
    if (!window.QuantumAPI) return;

    try {
      const stats = await window.QuantumAPI.getStats();
      this.updateStatCards(stats);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }

  updateStatCards(stats) {
    const elements = {
      'running-jobs': stats.runningJobs || 0,
      'queued-jobs': stats.queuedJobs || 0,
      'completed-jobs': stats.completedJobs || 0,
      'active-machines': stats.activeMachines || 0
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        const currentValue = parseInt(element.textContent) || 0;
        this.animateCounter(element, currentValue, value);
      }
    });
  }

  animateStatUpdates(stats) {
    const updates = [
      { id: 'running-jobs', value: stats.runningJobs || 0 },
      { id: 'queued-jobs', value: stats.queuedJobs || 0 },
      { id: 'completed-jobs', value: stats.completedJobs || 0 },
      { id: 'active-machines', value: stats.activeMachines || 0 }
    ];

    updates.forEach(({ id, value }) => {
      const element = document.getElementById(id);
      if (element) {
        const currentValue = parseInt(element.textContent) || 0;
        if (currentValue !== value) {
          // Add quantum flicker effect
          const card = element.closest('.stat-card');
          if (card) {
            card.classList.add('superposition-effect');
            setTimeout(() => {
              card.classList.remove('superposition-effect');
            }, 300);
          }
          
          this.animateCounter(element, currentValue, value);
        }
      }
    });
  }

  animateCounter(element, start, end, duration = 1000) {
    if (start === end) return;

    const startTime = performance.now();
    const difference = end - start;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easing function for smooth animation
      const easeProgress = this.easeInOutCubic(progress);
      const currentValue = Math.round(start + (difference * easeProgress));
      
      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  async refreshCharts() {
    if (!window.QuantumAPI || !window.QuantumCharts) return;

    try {
      const [stats, machines] = await Promise.all([
        window.QuantumAPI.getStats(),
        window.QuantumAPI.getMachines()
      ]);

      await Promise.all([
        window.QuantumCharts.updateStatusChart(stats),
        window.QuantumCharts.updateTimelineChart(),
        window.QuantumCharts.updateUtilizationChart(machines),
        window.QuantumCharts.updateSuccessChart(stats)
      ]);

    } catch (error) {
      console.error('Error refreshing charts:', error);
    }
  }

  async refreshActivity() {
    if (!window.QuantumAPI) return;

    try {
      const jobs = await window.QuantumAPI.getJobs({ limit: 15 });
      this.populateActivityFeed(jobs);
    } catch (error) {
      console.error('Error refreshing activity:', error);
    }
  }

  populateActivityFeed(jobs) {
    const feed = document.getElementById('activity-feed');
    if (!feed || !jobs) return;

    feed.innerHTML = '';

    jobs.slice(0, 8).forEach((job, index) => {
      const item = this.createActivityItem(job);
      item.style.animationDelay = `${index * 0.1}s`;
      item.classList.add('fadeInUp');
      feed.appendChild(item);
    });
  }

  createActivityItem(job) {
    const item = document.createElement('div');
    item.className = 'activity-item';

    const icon = this.getActivityIcon(job.status);
    const timeAgo = this.getTimeAgo(job.created);
    const description = this.getActivityDescription(job);

    item.innerHTML = `
      <div class="activity-icon ${job.status}">
        <i class="${icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${description}</div>
        <div class="activity-description">
          Backend: ${job.backend} • ${job.circuits} • ${job.shots.toLocaleString()} shots
        </div>
      </div>
      <div class="activity-time">${timeAgo}</div>
    `;

    return item;
  }

  getActivityIcon(status) {
    const icons = {
      running: 'fas fa-play-circle',
      queued: 'fas fa-clock',
      completed: 'fas fa-check-circle',
      failed: 'fas fa-exclamation-circle',
      cancelled: 'fas fa-times-circle'
    };
    return icons[status] || 'fas fa-circle';
  }

  getActivityDescription(job) {
    const descriptions = {
      running: `Job ${job.id} is now running`,
      queued: `Job ${job.id} added to queue`,
      completed: `Job ${job.id} completed successfully`,
      failed: `Job ${job.id} failed to execute`,
      cancelled: `Job ${job.id} was cancelled`
    };
    return descriptions[job.status] || `Job ${job.id} status updated`;
  }

  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }

  addNewJobsToActivity(jobs) {
    const feed = document.getElementById('activity-feed');
    if (!feed) return;

    jobs.forEach(job => {
      // Check if job is already in activity
      const existingItem = feed.querySelector(`[data-job-id="${job.id}"]`);
      if (existingItem) return;

      const item = this.createActivityItem(job);
      item.setAttribute('data-job-id', job.id);
      item.classList.add('slide-in-right');

      // Insert at the top
      feed.insertBefore(item, feed.firstChild);

      // Remove excess items
      const items = feed.querySelectorAll('.activity-item');
      if (items.length > this.maxActivityItems) {
        items[items.length - 1].remove();
      }

      // Add quantum flicker effect
      setTimeout(() => {
        item.classList.add('quantum-flicker');
        setTimeout(() => {
          item.classList.remove('quantum-flicker');
        }, 500);
      }, 100);
    });
  }

  async periodicUpdate() {
    try {
      // Randomly update some stats for demo purposes
      this.simulateStatChanges();
      
      // Occasionally add activity
      if (Math.random() < 0.3) {
        this.addRandomActivity();
      }
    } catch (error) {
      console.error('Error in periodic update:', error);
    }
  }

  simulateStatChanges() {
    // This simulates real-time changes for demo purposes
    const statElements = ['running-jobs', 'queued-jobs', 'completed-jobs'];
    
    statElements.forEach(id => {
      if (Math.random() < 0.2) { // 20% chance to change
        const element = document.getElementById(id);
        if (element) {
          const currentValue = parseInt(element.textContent) || 0;
          const change = Math.floor(Math.random() * 6) - 3; // -3 to +3
          const newValue = Math.max(0, currentValue + change);
          
          if (newValue !== currentValue) {
            const card = element.closest('.stat-card');
            if (card) {
              card.classList.add('wave-animation');
              setTimeout(() => {
                card.classList.remove('wave-animation');
              }, 2000);
            }
            
            this.animateCounter(element, currentValue, newValue);
          }
        }
      }
    });
  }

  addRandomActivity() {
    const activities = [
      {
        icon: 'fas fa-rocket',
        title: 'Quantum algorithm optimization completed',
        description: 'VQE convergence improved by 15%',
        type: 'success'
      },
      {
        icon: 'fas fa-sync-alt',
        title: 'Backend calibration in progress',
        description: 'ibm_brisbane undergoing maintenance',
        type: 'warning'
      },
      {
        icon: 'fas fa-chart-line',
        title: 'Queue processing accelerated',
        description: 'Average wait time reduced to 2.1 minutes',
        type: 'info'
      },
      {
        icon: 'fas fa-microchip',
        title: 'New quantum backend available',
        description: 'ibm_torino now accepting jobs',
        type: 'success'
      }
    ];

    const activity = activities[Math.floor(Math.random() * activities.length)];
    const feed = document.getElementById('activity-feed');
    if (!feed) return;

    const item = document.createElement('div');
    item.className = 'activity-item slide-in-right';
    item.innerHTML = `
      <div class="activity-icon ${activity.type}">
        <i class="${activity.icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${activity.title}</div>
        <div class="activity-description">${activity.description}</div>
      </div>
      <div class="activity-time">Just now</div>
    `;

    feed.insertBefore(item, feed.firstChild);

    // Remove excess items
    const items = feed.querySelectorAll('.activity-item');
    if (items.length > this.maxActivityItems) {
      items[items.length - 1].remove();
    }

    // Add glow effect
    setTimeout(() => {
      item.classList.add('glow-effect');
      setTimeout(() => {
        item.classList.remove('glow-effect');
      }, 2000);
    }, 100);
  }

  // Quantum-themed visual effects
  triggerQuantumWave() {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('wave-animation');
        setTimeout(() => {
          card.classList.remove('wave-animation');
        }, 2000);
      }, index * 200);
    });
  }

  triggerDataFlow() {
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach(chart => {
      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'data-particle';
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${i * 0.5}s`;
        chart.style.position = 'relative';
        chart.appendChild(particle);
        
        setTimeout(() => {
          particle.remove();
        }, 3000);
      }
    });
  }

  triggerInterferencePattern() {
    const dashboard = document.querySelector('.main-content');
    if (dashboard) {
      dashboard.classList.add('interference-pattern');
      setTimeout(() => {
        dashboard.classList.remove('interference-pattern');
      }, 4000);
    }
  }

  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    console.log('🧹 Dashboard cleaned up');
  }
}

// Create global instance
window.QuantumDashboard = new QuantumDashboard();

// Special quantum effects for demo
window.addEventListener('keydown', (e) => {
  if (!window.QuantumDashboard.isInitialized) return;
  
  // Easter eggs for judges!
  if (e.code === 'KeyQ' && e.ctrlKey) {
    e.preventDefault();
    window.QuantumDashboard.triggerQuantumWave();
  }
  
  if (e.code === 'KeyD' && e.ctrlKey) {
    e.preventDefault();
    window.QuantumDashboard.triggerDataFlow();
  }
  
  if (e.code === 'KeyI' && e.ctrlKey) {
    e.preventDefault();
    window.QuantumDashboard.triggerInterferencePattern();
  }
});

console.log('🎛️ Quantum Dashboard controller loaded');