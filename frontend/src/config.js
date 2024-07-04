// src/config.js

const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'https://thefaves-8616b810d2fc.herokuapp.com'
  : 'http://localhost:3000';

export default API_BASE_URL;