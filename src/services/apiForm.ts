import axios from 'axios';
import Cookies from "js-cookie";


const api = axios.create({
  baseURL: process.env.PUBLIC_API_FORM_URL || "http://ec2-3-135-247-190.us-east-2.compute.amazonaws.com:8080",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const authToken = Cookies.get("token");

  if (!config.headers) {
    config.headers = {};
  }

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
}, (error) => {
  console.error('Erro ao configurar o header de autorização:', error);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response; 
}, (error) => {
  if (error.response && error.response.status === 401 || error.response.status === 403) {
    console.warn("Token expirado ou inválido. Removendo token...");
    Cookies.remove("token"); 
  }

  return Promise.reject(error);
});

export default api;
