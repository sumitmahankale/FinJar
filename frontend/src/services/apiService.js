import config from '../config/config.js';

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };

    const requestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
          throw new Error('Session expired');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials) {
    return this.request(config.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request(config.endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    localStorage.removeItem('token');
    return Promise.resolve();
  }

  // User methods
  async getUserProfile() {
    return this.request(config.endpoints.user.profile);
  }

  async updateUserProfile(userData) {
    return this.request(config.endpoints.user.update, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Jar methods
  async getJars() {
    return this.request(config.endpoints.jar.list);
  }

  async createJar(jarData) {
    return this.request(config.endpoints.jar.create, {
      method: 'POST',
      body: JSON.stringify(jarData)
    });
  }

  async updateJar(jarId, jarData) {
    return this.request(`${config.endpoints.jar.update}/${jarId}`, {
      method: 'PUT',
      body: JSON.stringify(jarData)
    });
  }

  async deleteJar(jarId) {
    return this.request(`${config.endpoints.jar.delete}/${jarId}`, {
      method: 'DELETE'
    });
  }

  // Deposit methods
  async getDeposits(jarId) {
    return this.request(`${config.endpoints.deposit.list}?jarId=${jarId}`);
  }

  async createDeposit(depositData) {
    return this.request(config.endpoints.deposit.create, {
      method: 'POST',
      body: JSON.stringify(depositData)
    });
  }

  async updateDeposit(depositId, depositData) {
    return this.request(`${config.endpoints.deposit.update}/${depositId}`, {
      method: 'PUT',
      body: JSON.stringify(depositData)
    });
  }

  async deleteDeposit(depositId) {
    return this.request(`${config.endpoints.deposit.delete}/${depositId}`, {
      method: 'DELETE'
    });
  }
}

export default new ApiService();
