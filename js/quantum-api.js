/**
 * QUANTUM API SIMULATION
 * Team IGNITE - Championship Edition
 * 
 * Simulates IBM Quantum API for realistic demo data
 */

class QuantumAPI {
  constructor() {
    this.isInitialized = false;
    this.connectionStatus = 'offline';
    this.simulatedData = {
      jobs: [],
      machines: [],
      stats: {}
    };
    
    // IBM Quantum backend names for realism
    this.backendNames = [
      'ibm_brisbane',
      'ibm_kyoto',
      'ibm_osaka',
      'ibm_sherbrooke',
      'ibm_torino',
      'ibm_quebec',
      'ibmq_qasm_simulator',
      'simulator_mps',
      'simulator_extended_stabilizer',
      'simulator_stabilizer'
    ];

    this.jobStatuses = ['running', 'queued', 'completed', 'failed'];
    this.circuits = ['Bell State', 'GHZ State', 'Quantum Fourier Transform', 'Grover Search', 'Variational Quantum Eigensolver', 'Quantum Approximate Optimization', 'Shor Algorithm', 'Random Circuit'];
  }

  async initialize() {
    console.log('🔗 Connecting to IBM Quantum Network...');
    
    // Simulate connection delay
    await this.delay(1000);
    
    try {
      // Generate initial data
      this.generateMachines();
      this.generateJobs(50);
      this.generateStats();
      
      this.connectionStatus = 'online';
      this.isInitialized = true;
      
      console.log('✅ Connected to IBM Quantum Network');
      
      // Start real-time updates
      this.startRealTimeUpdates();
      
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to IBM Quantum Network:', error);
      this.connectionStatus = 'offline';
      throw error;
    }
  }

  generateMachines() {
    const machineConfigs = [
      { name: 'ibm_brisbane', location: 'IBM Quantum Network', qubits: 127, type: 'superconducting' },
      { name: 'ibm_kyoto', location: 'IBM Quantum Network', qubits: 127, type: 'superconducting' },
      { name: 'ibm_osaka', location: 'IBM Quantum Network', qubits: 127, type: 'superconducting' },
      { name: 'ibm_sherbrooke', location: 'IBM Quantum Network', qubits: 127, type: 'superconducting' },
      { name: 'ibm_torino', location: 'IBM Quantum Network', qubits: 133, type: 'superconducting' },
      { name: 'ibm_quebec', location: 'IBM Quantum Network', qubits: 27, type: 'superconducting' },
      { name: 'ibmq_qasm_simulator', location: 'Cloud Simulator', qubits: 32, type: 'simulator' },
      { name: 'simulator_mps', location: 'Cloud Simulator', qubits: 100, type: 'simulator' }
    ];

    this.simulatedData.machines = machineConfigs.map(config => ({
      ...config,
      id: this.generateId(),
      status: this.randomChoice(['online', 'maintenance', 'offline'], [0.8, 0.15, 0.05]),
      pending: this.randomInt(0, 50),
      fidelity: this.randomFloat(85, 99),
      uptime: this.randomFloat(95, 99.9),
      lastUpdate: new Date().toISOString()
    }));
  }

  generateJobs(count = 50) {
    this.simulatedData.jobs = [];
    
    for (let i = 0; i < count; i++) {
      const job = {
        id: this.generateJobId(),
        status: this.randomChoice(this.jobStatuses, [0.15, 0.25, 0.55, 0.05]),
        backend: this.randomChoice(this.backendNames),
        circuits: this.randomChoice(this.circuits),
        shots: this.randomChoice([1024, 2048, 4096, 8192]),
        created: this.randomDateInPast(7), // Within last 7 days
        duration: null,
        qubits: this.randomInt(2, 20),
        depth: this.randomInt(10, 100),
        userId: `user_${this.randomInt(1000, 9999)}`
      };

      // Set duration for completed/failed jobs
      if (job.status === 'completed' || job.status === 'failed') {
        job.duration = this.formatDuration(this.randomInt(10, 3600)); // 10 seconds to 1 hour
      }

      this.simulatedData.jobs.push(job);
    }

    // Sort by creation date (newest first)
    this.simulatedData.jobs.sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  generateStats() {
    const jobs = this.simulatedData.jobs;
    const machines = this.simulatedData.machines;

    this.simulatedData.stats = {
      runningJobs: jobs.filter(j => j.status === 'running').length,
      queuedJobs: jobs.filter(j => j.status === 'queued').length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      failedJobs: jobs.filter(j => j.status === 'failed').length,
      activeMachines: machines.filter(m => m.status === 'online').length,
      totalMachines: machines.length,
      averageWaitTime: this.randomFloat(1.5, 5.0), // minutes
      successRate: this.randomFloat(92, 97), // percentage
      totalJobsToday: jobs.filter(j => {
        const today = new Date();
        const jobDate = new Date(j.created);
        return jobDate.toDateString() === today.toDateString();
      }).length
    };
  }

  async getJobs(filters = {}) {
    if (!this.isInitialized) {
      throw new Error('API not initialized');
    }

    await this.delay(200); // Simulate API delay

    let jobs = [...this.simulatedData.jobs];

    // Apply filters
    if (filters.status) {
      jobs = jobs.filter(job => job.status === filters.status);
    }

    if (filters.backend) {
      jobs = jobs.filter(job => job.backend === filters.backend);
    }

    if (filters.limit) {
      jobs = jobs.slice(0, filters.limit);
    }

    return jobs;
  }

  async getJob(jobId) {
    if (!this.isInitialized) {
      throw new Error('API not initialized');
    }

    await this.delay(150);

    const job = this.simulatedData.jobs.find(j => j.id === jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    return job;
  }

  async getMachines() {
    if (!this.isInitialized) {
      throw new Error('API not initialized');
    }

    await this.delay(100);
    return [...this.simulatedData.machines];
  }

  async getStats() {
    if (!this.isInitialized) {
      throw new Error('API not initialized');
    }

    await this.delay(50);
    return { ...this.simulatedData.stats };
  }

  async submitJob(jobData) {
    if (!this.isInitialized) {
      throw new Error('API not initialized');
    }

    await this.delay(300);

    const newJob = {
      id: this.generateJobId(),
      status: 'queued',
      backend: jobData.backend || this.randomChoice(this.backendNames),
      circuits: jobData.circuits || 'Custom Circuit',
      shots: jobData.shots || 1024,
      created: new Date().toISOString(),
      duration: null,
      qubits: jobData.qubits || this.randomInt(2, 10),
      depth: jobData.depth || this.randomInt(10, 50),
      userId: jobData.userId || 'demo_user'
    };

    this.simulatedData.jobs.unshift(newJob);
    this.generateStats();

    return newJob;
  }

  async cancelJob(jobId) {
    if (!this.isInitialized) {
      throw new Error('API not initialized');
    }

    await this.delay(200);

    const jobIndex = this.simulatedData.jobs.findIndex(j => j.id === jobId);
    if (jobIndex === -1) {
      throw new Error('Job not found');
    }

    const job = this.simulatedData.jobs[jobIndex];
    if (job.status === 'completed' || job.status === 'failed') {
      throw new Error('Cannot cancel completed job');
    }

    job.status = 'cancelled';
    this.generateStats();

    return job;
  }

  getConnectionStatus() {
    return this.connectionStatus;
  }

  startRealTimeUpdates() {
    // Simulate real-time job status changes
    setInterval(() => {
      this.updateJobStatuses();
      this.updateMachineStatuses();
      this.generateStats();
      
      // Emit update event
      window.dispatchEvent(new CustomEvent('quantumDataUpdated', {
        detail: {
          stats: this.simulatedData.stats,
          jobs: this.simulatedData.jobs.slice(0, 10) // Latest 10 jobs
        }
      }));
    }, 5000); // Update every 5 seconds

    // Occasionally add new jobs
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance
        this.addRandomJob();
      }
    }, 10000); // Check every 10 seconds
  }

  updateJobStatuses() {
    this.simulatedData.jobs.forEach(job => {
      if (job.status === 'queued' && Math.random() < 0.1) {
        job.status = 'running';
      } else if (job.status === 'running' && Math.random() < 0.15) {
        job.status = Math.random() < 0.9 ? 'completed' : 'failed';
        job.duration = this.formatDuration(this.randomInt(30, 1800));
      }
    });
  }

  updateMachineStatuses() {
    this.simulatedData.machines.forEach(machine => {
      // Occasionally change machine status
      if (Math.random() < 0.02) { // 2% chance
        const statuses = ['online', 'maintenance', 'offline'];
        const weights = [0.8, 0.15, 0.05];
        machine.status = this.randomChoice(statuses, weights);
      }
      
      // Update pending jobs count
      machine.pending = Math.max(0, machine.pending + this.randomInt(-3, 3));
      
      // Slightly vary fidelity and uptime
      machine.fidelity = Math.max(80, Math.min(99.9, machine.fidelity + this.randomFloat(-0.5, 0.5)));
      machine.uptime = Math.max(90, Math.min(99.9, machine.uptime + this.randomFloat(-0.1, 0.1)));
    });
  }

  addRandomJob() {
    const newJob = {
      id: this.generateJobId(),
      status: 'queued',
      backend: this.randomChoice(this.backendNames),
      circuits: this.randomChoice(this.circuits),
      shots: this.randomChoice([1024, 2048, 4096]),
      created: new Date().toISOString(),
      duration: null,
      qubits: this.randomInt(2, 15),
      depth: this.randomInt(10, 80),
      userId: `user_${this.randomInt(1000, 9999)}`
    };

    this.simulatedData.jobs.unshift(newJob);
    
    // Keep only last 100 jobs
    if (this.simulatedData.jobs.length > 100) {
      this.simulatedData.jobs = this.simulatedData.jobs.slice(0, 100);
    }
  }

  // Utility methods
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  generateJobId() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomFloat(min, max, precision = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(precision));
  }

  randomChoice(array, weights = null) {
    if (!weights) {
      return array[Math.floor(Math.random() * array.length)];
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < array.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return array[i];
      }
    }

    return array[array.length - 1];
  }

  randomDateInPast(days) {
    const now = new Date();
    const pastTime = now.getTime() - (Math.random() * days * 24 * 60 * 60 * 1000);
    return new Date(pastTime).toISOString();
  }

  formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create global instance
window.QuantumAPI = new QuantumAPI();

console.log('⚛️ Quantum API simulation loaded');