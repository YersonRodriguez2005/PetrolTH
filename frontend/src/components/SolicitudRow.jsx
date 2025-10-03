import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { agregarNumeroSolicitud, agregarNumeroOrden, cambiarEstado, deleteSolicitud, generarReporte } from '../services/api';

const SolicitudRow = ({ solicitud, onUpdate }) => {
  const { isAdmin, user } = useAuth();
  const [editandoSolicitud, setEditandoSolicitud] = useState(false);
  const [editandoOrden, setEditandoOrden] = useState(false);
  const [numeroSolicitud, setNumeroSolicitud] = useState(solicitud.numero_solicitud || '');
  const [numeroOrden, setNumeroOrden] = useState(solicitud.numero_orden || '');
  const [loading, setLoading] = useState(false);

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Aprobada': return 'bg-green-100 text-green-800';
      case 'Anulada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAgregarSolicitud = async () => {
    if (!numeroSolicitud.trim()) {
      alert('Ingrese un número de solicitud');
      return;
    }

    setLoading(true);
    try {
      await agregarNumeroSolicitud(solicitud.id, numeroSolicitud);
      alert('Número de solicitud actualizado exitosamente');
      setEditandoSolicitud(false);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al actualizar número de solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarOrden = async () => {
    if (!numeroOrden.trim()) {
      alert('Ingrese un número de orden');
      return;
    }

    setLoading(true);
    try {
      await agregarNumeroOrden(solicitud.id, numeroOrden);
      alert('Número de orden actualizado exitosamente');
      setEditandoOrden(false);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al actualizar número de orden');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (campo, valor) => {
    if (!window.confirm(`¿Confirmar cambio de estado a "${valor}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await cambiarEstado(solicitud.id, { [campo]: valor });
      alert('Estado actualizado exitosamente');
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al cambiar estado');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Está seguro de eliminar esta solicitud?')) {
      return;
    }

    setLoading(true);
    try {
      await deleteSolicitud(solicitud.id);
      alert('Solicitud eliminada exitosamente');
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarReporte = async () => {
    try {
      const response = await generarReporte(solicitud.id);
      alert('Reporte generado - Ver consola para datos');
      console.log('Reporte:', response.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Error al generar reporte');
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const puedeEditarSolicitud = solicitud.creado_por === user.usuario || isAdmin();
  const puedeEditarOrden = solicitud.creado_por === user.usuario || isAdmin();
  const puedeEliminar = isAdmin();
  const puedeCambiarEstado = isAdmin();

  return (
    <tr className={loading ? 'opacity-50' : ''}>
      <td className="px-4 py-3 text-sm">{solicitud.id}</td>
      <td className="px-4 py-3 text-sm">{solicitud.empleado}</td>
      <td className="px-4 py-3 text-sm">{solicitud.tipo_solicitud}</td>
      
      {/* Número de Solicitud */}
      <td className="px-4 py-3 text-sm">
        {editandoSolicitud ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={numeroSolicitud}
              onChange={(e) => setNumeroSolicitud(e.target.value)}
              className="w-32 px-2 py-1 border rounded text-xs"
              placeholder="N° Solicitud"
            />
            <button
              onClick={handleAgregarSolicitud}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              disabled={loading}
            >
              ✓
            </button>
            <button
              onClick={() => {
                setEditandoSolicitud(false);
                setNumeroSolicitud(solicitud.numero_solicitud || '');
              }}
              className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{solicitud.numero_solicitud || '-'}</span>
            {puedeEditarSolicitud && (
              <button
                onClick={() => setEditandoSolicitud(true)}
                className="text-blue-600 hover:text-blue-800 text-xs"
              >
                {solicitud.numero_solicitud ? '✏️' : 'Agregar'}
              </button>
            )}
          </div>
        )}
      </td>

      {/* Estado Solicitud */}
      <td className="px-4 py-3 text-sm">
        {puedeCambiarEstado ? (
          <select
            value={solicitud.estado_solicitud}
            onChange={(e) => handleCambiarEstado('estado_solicitud', e.target.value)}
            className={`px-2 py-1 rounded text-xs ${getEstadoColor(solicitud.estado_solicitud)}`}
            disabled={loading}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Anulada">Anulada</option>
          </select>
        ) : (
          <span className={`px-2 py-1 rounded text-xs ${getEstadoColor(solicitud.estado_solicitud)}`}>
            {solicitud.estado_solicitud}
          </span>
        )}
      </td>

      {/* Número de Orden */}
      <td className="px-4 py-3 text-sm">
        {editandoOrden ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={numeroOrden}
              onChange={(e) => setNumeroOrden(e.target.value)}
              className="w-32 px-2 py-1 border rounded text-xs"
              placeholder="N° Orden"
            />
            <button
              onClick={handleAgregarOrden}
              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              disabled={loading}
            >
              ✓
            </button>
            <button
              onClick={() => {
                setEditandoOrden(false);
                setNumeroOrden(solicitud.numero_orden || '');
              }}
              className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{solicitud.numero_orden || '-'}</span>
            {puedeEditarOrden && (
              <button
                onClick={() => setEditandoOrden(true)}
                className="text-blue-600 hover:text-blue-800 text-xs"
              >
                {solicitud.numero_orden ? '✏️' : 'Agregar'}
              </button>
            )}
          </div>
        )}
      </td>

      {/* Estado Orden */}
      <td className="px-4 py-3 text-sm">
        {puedeCambiarEstado && solicitud.numero_orden ? (
          <select
            value={solicitud.estado_orden}
            onChange={(e) => handleCambiarEstado('estado_orden', e.target.value)}
            className={`px-2 py-1 rounded text-xs ${getEstadoColor(solicitud.estado_orden)}`}
            disabled={loading}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Anulada">Anulada</option>
          </select>
        ) : (
          <span className={`px-2 py-1 rounded text-xs ${getEstadoColor(solicitud.estado_orden)}`}>
            {solicitud.estado_orden}
          </span>
        )}
      </td>

      <td className="px-4 py-3 text-sm">{solicitud.creado_por}</td>
      <td className="px-4 py-3 text-sm">{formatFecha(solicitud.fecha_creacion)}</td>
      
      <td className="px-4 py-3 text-sm">
        <div className="flex gap-1">
          {solicitud.estado_orden === 'Aprobada' && (
            <button
              onClick={handleGenerarReporte}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              title="Generar Reporte"
            >
              📄
            </button>
          )}
          {puedeEliminar && (
            <button
              onClick={handleEliminar}
              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              disabled={loading}
              title="Eliminar"
            >
              🗑️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default SolicitudRow;