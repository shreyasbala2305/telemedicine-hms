import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081', // auth-service base URL
});

export default api;
