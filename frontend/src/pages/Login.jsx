import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLoader, FiUser, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";

const PRIMARY_RED = "#C70000"; // Rojo corporativo
const PRIMARY_BLUE = "#2B3D8C"; // Azul corporativo


const Login = () => {
  const [credentials, setCredentials] = useState({ usuario: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const mensajes = {
    camposVacios: "Por favor, ingresa tu usuario y contraseña.",
    errorConexion: "Error de conexión. Inténtalo más tarde.",
    errorInesperado: "Ocurrió un error inesperado. Verifica tu conexión.",
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value.trimStart(),
    });
    if (error) setError(""); // limpia error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { usuario, password } = credentials;

    if (!usuario || !password) {
      setError(mensajes.camposVacios);
      setLoading(false);
      return;
    }

    try {
      const result = await login(credentials);
      if (result.success) {
        navigate("/solicitudes");
      } else {
        setError(result.error || mensajes.errorConexion);
      }
    } catch {
      setError(mensajes.errorInesperado);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border"
        style={{ borderColor: PRIMARY_BLUE }}
        role="main"
        aria-label="Formulario de inicio de sesión"
      >
        <header
          className="py-12 px-10 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${PRIMARY_BLUE} 0%, #1A2460 100%)`,
          }}
        >
          {/* Fondo animado sutil */}
          <div className="absolute inset-0 opacity-15">
            <div className="w-[200%] h-full bg-[radial-gradient(circle_at_center,white,transparent_70%)] animate-pulse" />
          </div>

          {/* Logo */}
          <motion.h1
            className="relative text-5xl md:text-6xl font-extrabold uppercase tracking-[0.35em] leading-none select-none drop-shadow-xl"
            aria-label="Logo PetrolFlow"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span
              style={{ color: PRIMARY_RED }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              P
            </motion.span>
            <span className="text-white">ETROLFLOW</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            className="text-base md:text-lg text-gray-100 mt-2 font-medium tracking-wide drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Sistema de Gestión Logística
          </motion.p>
        </header>

        {/* Form */}
        <section className="p-10">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center select-none">
            Acceder al Sistema 🔑
          </h2>

          <form onSubmit={handleSubmit} className="space-y-7" noValidate>
            {/* Usuario */}
            <label htmlFor="usuario" className="block relative">
              <FiUser
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                aria-hidden="true"
                size={20}
              />
              <input
                id="usuario"
                name="usuario"
                type="text"
                value={credentials.usuario}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                autoComplete="username"
                disabled={loading}
                required
                aria-required="true"
                aria-invalid={!!error}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
              />
            </label>

            {/* Contraseña */}
            <label htmlFor="password" className="block relative">
              <FiLock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                aria-hidden="true"
                size={20}
              />
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Contraseña"
                autoComplete="current-password"
                disabled={loading}
                required
                aria-required="true"
                aria-invalid={!!error}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition duration-300"
              />
            </label>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-center bg-red-50 border border-red-300 text-red-700 px-5 py-3 rounded-lg text-sm font-medium select-none"
              >
                <span className="mr-2" aria-hidden="true">
                  ⚠️
                </span>
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-3 bg-red-700 hover:bg-red-800 active:bg-red-900
                text-white font-semibold py-4 rounded-xl shadow-lg transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin text-xl" aria-hidden="true" />
                  <span>Ingresando...</span>
                </>
              ) : (
                <span>Ingresar</span>
              )}
            </button>
          </form>

          {/* Credenciales demo */}
          <aside
            className="mt-10 p-5 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-600 text-xs select-none"
            aria-label="Credenciales de demostración"
          >
            <p
              className="font-semibold mb-3 text-center"
              style={{ color: PRIMARY_BLUE }}
            >
              <span className="mr-1" aria-hidden="true">
                ℹ️
              </span>
              Para demostración:
            </p>
            <div className="flex justify-around text-center space-x-6">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Usuario Estándar:</p>
                <p className="font-mono text-xs">usuario1 / Petrol1234*</p>
              </div>
              <div className="border-l border-gray-300" aria-hidden="true"></div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Usuario Admin:</p>
                <p className="font-mono text-xs">admin / PetrolAdmin1234*</p>
              </div>
            </div>
          </aside>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-gray-100 text-center text-xs text-gray-400 select-none">
            © {new Date().getFullYear()} PetrolFlow.
          </footer>
        </section>
      </div>
    </div>
  );
};

export default Login;
