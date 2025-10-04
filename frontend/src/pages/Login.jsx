import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    usuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔐 Intentando login con:', credentials.usuario);

    const result = await login(credentials);
    
    console.log('📝 Resultado del login:', result);
    
    if (result.success) {
      console.log('✅ Login exitoso, redirigiendo...');
      navigate('/solicitudes');
    } else {
      console.error('❌ Error de login:', result.error);
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2D4373] to-[#1e2d4f] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2D4373] to-[#C4181E] rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">PetrolFlow</h2>
          <p className="text-gray-600 mt-2">Sistema de Solicitudes y Órdenes</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              name="usuario"
              value={credentials.usuario}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D4373] focus:border-transparent transition-all"
              required
              autoComplete="username"
              placeholder="Ingrese su usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D4373] focus:border-transparent transition-all"
              required
              autoComplete="current-password"
              placeholder="Ingrese su contraseña"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-[#C4181E] text-red-900 px-4 py-3 rounded-r">
              <div className="flex items-start">
                <span className="text-xl mr-2">⚠️</span>
                <div>
                  <p className="font-bold">Error:</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#C4181E] to-[#a01419] text-white py-3 rounded-lg hover:from-[#a01419] hover:to-[#C4181E] transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </span>
            ) : (
              'Ingresar al Sistema'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-red-50 rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-3 text-center">Credenciales de prueba:</p>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold">Usuario Normal</p>
              <p className="text-sm"><strong className="text-[#2D4373]">Usuario:</strong> usuario1</p>
              <p className="text-sm"><strong className="text-[#2D4373]">Contraseña:</strong> Petrol1234*</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-semibold">Administrador</p>
              <p className="text-sm"><strong className="text-[#C4181E]">Usuario:</strong> admin</p>
              <p className="text-sm"><strong className="text-[#C4181E]">Contraseña:</strong> PetrolAdmin1234*</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;