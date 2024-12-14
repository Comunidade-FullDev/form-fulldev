import axios from 'axios';
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_FORM_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('tokenExpired'));
    }
  }

  return Promise.reject(error);
});

export default api;
