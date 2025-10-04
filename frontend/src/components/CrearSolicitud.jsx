import { useState } from 'react';
import { createSolicitud } from '../services/api';

const CrearSolicitud = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    empleado: '',
    tipo_solicitud: 'Examen',
    numero_solicitud: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createSolicitud(formData);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear solicitud');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-[#2D4373]">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2D4373] to-[#C4181E] rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-xl">📝</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Nueva Solicitud</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre del Empleado *
          </label>
          <input
            type="text"
            name="empleado"
            value={formData.empleado}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D4373] focus:border-transparent transition-all"
            required
            minLength={3}
            maxLength={100}
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo de Solicitud *
          </label>
          <select
            name="tipo_solicitud"
            value={formData.tipo_solicitud}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D4373] focus:border-transparent transition-all"
            required
          >
            <option value="Examen">🔬 Examen</option>
            <option value="Cursos">📚 Cursos</option>
            <option value="Dotación">👔 Dotación</option>
            <option value="Otros">📌 Otros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número de Solicitud *
          </label>
          <input
            type="text"
            name="numero_solicitud"
            value={formData.numero_solicitud}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D4373] focus:border-transparent transition-all"
            placeholder="Ej: SOL-001"
            required
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Ingrese un número único de solicitud
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-[#C4181E] text-red-900 px-4 py-3 rounded-r">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#C4181E] to-[#a01419] text-white py-3 rounded-lg hover:from-[#a01419] hover:to-[#C4181E] transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            ) : (
              '✓ Crear Solicitud'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-all font-semibold"
          >
            ✕ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearSolicitud;