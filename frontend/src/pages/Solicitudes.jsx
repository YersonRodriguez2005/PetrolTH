import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSolicitudes, getSolicitudesByUsuario } from '../services/api';
import Layout from '../components/Layout';
import CrearSolicitud from '../components/CrearSolicitud';
import SolicitudRow from '../components/SolicitudRow';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCrear, setShowCrear] = useState(false);
  const [verTodas, setVerTodas] = useState(false);
  
  const { user, isAdmin } = useAuth();

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (isAdmin() && verTodas) {
        response = await getSolicitudes();
      } else {
        response = await getSolicitudesByUsuario(user.usuario);
      }
      
      setSolicitudes(response.data);
    } catch (err) {
      setError('Error al cargar solicitudes: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [verTodas]);

  const handleSolicitudCreada = () => {
    setShowCrear(false);
    cargarSolicitudes();
  };

  const handleSolicitudActualizada = () => {
    cargarSolicitudes();
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Cargando solicitudes...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Solicitudes y Órdenes</h2>
          <div className="flex gap-2">
            {isAdmin() && (
              <button
                onClick={() => setVerTodas(!verTodas)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {verTodas ? 'Ver Mis Solicitudes' : 'Ver Todas'}
              </button>
            )}
            <button
              onClick={() => setShowCrear(!showCrear)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {showCrear ? 'Cancelar' : 'Nueva Solicitud'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {showCrear && (
          <CrearSolicitud 
            onClose={() => setShowCrear(false)}
            onCreated={handleSolicitudCreada}
          />
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Solicitud</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado Solicitud</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Orden</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado Orden</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado Por</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitudes.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      No hay solicitudes registradas
                    </td>
                  </tr>
                ) : (
                  solicitudes.map(solicitud => (
                    <SolicitudRow 
                      key={solicitud.id} 
                      solicitud={solicitud}
                      onUpdate={handleSolicitudActualizada}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Solicitudes;