const config = {
  API_BASE_URL: 'https://finjar.onrender.com',
  ENV: 'production',
  
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
