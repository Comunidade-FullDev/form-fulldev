import axios from 'axios';
import Cookies from "js-cookie";


const api = axios.create({
  baseURL: process.env.PUBLIC_API_FORM_URL || "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const authToken  = Cookies.get("token");

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

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       console.error('Erro na requisição:', error.response || error.message);
//       return Promise.reject(error);
//     }
//   );
  

export default api;
