import config from '../config/config.js';

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    // Support both 'token' (new) and legacy 'authToken'
    let token = localStorage.getItem('token');
    if (!token) {
      token = localStorage.getItem('authToken');
      if (token) {
        // migrate silently
        localStorage.setItem('token', token);
      }
    }
    
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

  const text = await response.text();
  if (!text) return {};
  try { return JSON.parse(text); } catch { return { raw: text }; }
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
  const data = await this.request(config.endpoints.jar.list + '?flat=1');
  // If wrapped response
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.jars)) return data.jars;
  return [];
  }

  async createJar(jarData) {
    // Ensure backend field name compatibility
    const payload = { ...jarData };
    if (payload.title && !payload.name) payload.name = payload.title;
    delete payload.title; // backend uses name
    return this.request(config.endpoints.jar.create, {
      method: 'POST',
      body: JSON.stringify(payload)
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
  const data = await this.request(`/api/deposits/jar/${jarId}`);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.deposits)) return data.deposits;
  return [];
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
