import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Sistema de Solicitudes</h1>
              
              <Link 
                to="/solicitudes" 
                className="px-3 py-2 rounded hover:bg-blue-700"
              >
                Solicitudes
              </Link>
              
              {isAdmin() && (
                <Link 
                  to="/usuarios" 
                  className="px-3 py-2 rounded hover:bg-blue-700"
                >
                  Usuarios
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm">
                {user?.usuario} ({user?.rol})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;