import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://petrolth.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');

// Solicitudes
export const getSolicitudes = () => api.get('/solicitudes');
export const getSolicitudById = (id) => api.get(`/solicitudes/${id}`);
export const getSolicitudesByUsuario = (usuario) => api.get(`/solicitudes/usuario/${usuario}`);
export const createSolicitud = (data) => api.post('/solicitudes', data);
export const agregarNumeroSolicitud = (id, numero_solicitud) => 
  api.put(`/solicitudes/${id}/numero-solicitud`, { numero_solicitud });
export const agregarNumeroOrden = (id, numero_orden) => 
  api.put(`/solicitudes/${id}/numero-orden`, { numero_orden });
export const cambiarEstado = (id, estados) => 
  api.put(`/solicitudes/${id}/estado`, estados);
export const deleteSolicitud = (id) => api.delete(`/solicitudes/${id}`);
export const generarReporte = (id) => api.get(`/solicitudes/${id}/reporte`);

// Usuarios (Admin)
export const getUsuarios = () => api.get('/usuarios');
export const createUsuario = (data) => api.post('/usuarios', data);
export const updateUsuario = (id, data) => api.put(`/usuarios/${id}`, data);
export const deleteUsuario = (id) => api.delete(`/usuarios/${id}`);

export default api;