import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, logout as logoutApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('usuario');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔄 Enviando petición de login...');
      const response = await loginApi(credentials);
      console.log('📥 Respuesta recibida:', response.data);
      
      const { token, usuario } = response.data;
      
      if (!token || !usuario) {
        throw new Error('Respuesta incompleta del servidor');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
      setUser(usuario);
      
      console.log('✅ Login exitoso, usuario guardado:', usuario);
      return { success: true };
    } catch (error) {
      console.error('❌ Error completo:', error);
      console.error('📄 Respuesta del error:', error.response?.data);
      
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response) {
        // El servidor respondió con un error
        errorMessage = error.response.data?.message || `Error ${error.response.status}`;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifique que el backend esté corriendo.';
      } else {
        // Error al configurar la petición
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUser(null);
    }
  };

  const isAdmin = () => {
    return user?.rol === 'Administrador';
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};