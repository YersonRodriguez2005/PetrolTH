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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-gradient-to-r from-[#2B3D8C] to-[#1e2d4f] text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo y enlaces */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-md">
                  <svg
                    className="w-6 h-6 text-[#C70000]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-bold tracking-wide">PetrolFlow</h1>
              </div>

              <Link
                to="/solicitudes"
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
              >
                📋 Solicitudes
              </Link>

              {isAdmin() && (
                <Link
                  to="/usuarios"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-medium"
                >
                  👥 Usuarios
                </Link>
              )}
            </div>

            {/* Usuario y botón de salir */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.usuario}</p>
                <p
                  className={`text-xs ${
                    user?.rol === 'Administrador'
                      ? 'text-[#C70000] bg-white px-2 py-0.5 rounded-full font-bold'
                      : 'text-gray-300'
                  }`}
                >
                  {user?.rol}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#C70000] rounded-lg hover:bg-[#a01419] transition-colors font-medium shadow-md"
              >
                🚪 Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2025 PetrolFlow — Sistema de Gestión de Solicitudes y Órdenes</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
