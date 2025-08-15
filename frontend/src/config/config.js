const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  ENV: import.meta.env.VITE_ENV || 'development',
  
  // API endpoints
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout'
    },
    user: {
      profile: '/api/user/profile',
      update: '/api/user/update'
    },
    jar: {
      list: '/api/jars',
      create: '/api/jars',
      update: '/api/jars',
      delete: '/api/jars'
    },
    deposit: {
      list: '/api/deposits',
      create: '/api/deposits',
      update: '/api/deposits',
      delete: '/api/deposits'
    }
  }
};

export default config;
