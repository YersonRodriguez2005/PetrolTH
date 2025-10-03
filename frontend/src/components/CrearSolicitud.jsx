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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Nueva Solicitud</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del Empleado *
          </label>
          <input
            type="text"
            name="empleado"
            value={formData.empleado}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={3}
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Tipo de Solicitud *
          </label>
          <select
            name="tipo_solicitud"
            value={formData.tipo_solicitud}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Examen">Examen</option>
            <option value="Cursos">Cursos</option>
            <option value="Dotación">Dotación</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Número de Solicitud *
          </label>
          <input
            type="text"
            name="numero_solicitud"
            value={formData.numero_solicitud}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: SOL-001"
            required
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingrese un número único de solicitud
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creando...' : 'Crear Solicitud'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearSolicitud;