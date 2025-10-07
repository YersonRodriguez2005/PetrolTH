import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  agregarNumeroSolicitud, 
  agregarNumeroOrden, 
  cambiarEstado, 
  deleteSolicitud, 
  generarReporte 
} from '../services/api';

const SolicitudRow = ({ solicitud, onUpdate }) => {
  const { isAdmin, user } = useAuth();

  const [editandoSolicitud, setEditandoSolicitud] = useState(false);
  const [editandoOrden, setEditandoOrden] = useState(false);
  const [numeroSolicitud, setNumeroSolicitud] = useState(solicitud.numero_solicitud || '');
  const [numeroOrden, setNumeroOrden] = useState(solicitud.numero_orden || '');
  const [loading, setLoading] = useState(false);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Aprobada': return 'bg-green-100 text-green-800 border border-green-300';
      case 'Anulada': return 'bg-red-100 text-red-800 border border-red-300';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // --- 🧩 Handlers ---
  const handleAgregarSolicitud = async () => {
    if (!numeroSolicitud.trim()) {
      alert('Ingrese un número de solicitud');
      return;
    }

    setLoading(true);
    try {
      await agregarNumeroSolicitud(solicitud.id, numeroSolicitud);
      alert('✓ Número de solicitud actualizado exitosamente');
      setEditandoSolicitud(false);
      onUpdate();
    } catch (error) {
      console.error('Error completo:', error);
      alert('❌ ' + (error.response?.data?.message || 'Error al actualizar número de solicitud'));
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
      alert('✓ Número de orden actualizado exitosamente');
      setEditandoOrden(false);
      onUpdate();
    } catch (error) {
      console.error('Error completo:', error);
      alert('❌ ' + (error.response?.data?.message || 'Error al actualizar número de orden'));
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (campo, valor) => {
    if (!window.confirm(`¿Confirmar cambio de estado a "${valor}"?`)) return;

    setLoading(true);
    try {
      const payload = { [campo]: valor };
      await cambiarEstado(solicitud.id, payload);
      alert('✓ Estado actualizado exitosamente');
      onUpdate();
    } catch (error) {
      console.error('❌ Error completo:', error);
      alert('❌ ' + (error.response?.data?.message || 'Error al cambiar estado'));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('⚠️ ¿Está seguro de eliminar esta solicitud?\n\nEsta acción no se puede deshacer.')) return;

    setLoading(true);
    try {
      await deleteSolicitud(solicitud.id);
      alert('✓ Solicitud eliminada exitosamente');
      onUpdate();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Error al eliminar solicitud'));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarReporte = async () => {
    try {
      const response = await generarReporte(solicitud.id);
      alert('✓ Reporte generado - Ver consola para datos completos');
      console.log('📄 Reporte de Solicitud:', response.data);
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Error al generar reporte'));
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // --- 🧠 Permisos y control lógico ---
  const puedeEditarNumeros = true;
  const puedeEliminar = isAdmin?.();
  const puedeCambiarEstado = isAdmin?.();

  // Debug opcional
  console.debug('Renderizando fila:', {
    id: solicitud.id,
    numero_solicitud: solicitud.numero_solicitud,
    puedeCambiarEstado,
    isAdmin: isAdmin?.(),
    userRole: user?.rol
  });

  // --- JSX ---
  return (
    <tr className={`hover:bg-gray-50 transition-colors ${loading ? 'opacity-50' : ''}`}>
      <td className="px-4 py-4 text-sm font-semibold text-[#2D4373]">#{solicitud.id}</td>
      <td className="px-4 py-4 text-sm font-medium text-gray-900">{solicitud.empleado}</td>
      <td className="px-4 py-4 text-sm">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
          {solicitud.tipo_solicitud}
        </span>
      </td>

      {/* Número de Solicitud */}
      <td className="px-4 py-4 text-sm">
        {editandoSolicitud ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={numeroSolicitud}
              onChange={(e) => setNumeroSolicitud(e.target.value)}
              className="w-32 px-3 py-2 border-2 border-[#2D4373] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4373]"
              placeholder="SOL-XXX"
              autoFocus
            />
            <button onClick={handleAgregarSolicitud} className="px-3 py-2 bg-[#C4181E] text-white rounded-lg text-xs hover:bg-[#a01419] font-semibold" disabled={loading}>✓</button>
            <button onClick={() => { setEditandoSolicitud(false); setNumeroSolicitud(solicitud.numero_solicitud || ''); }} className="px-3 py-2 bg-gray-400 text-white rounded-lg text-xs hover:bg-gray-500">✕</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {solicitud.numero_solicitud ? (
              <span className="px-3 py-1 bg-[#2D4373] text-white rounded-lg font-bold text-sm">
                {solicitud.numero_solicitud}
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-lg text-xs italic">Sin número</span>
            )}
            {puedeEditarNumeros && (
              <button onClick={() => setEditandoSolicitud(true)} className="text-[#2D4373] hover:text-[#C4181E] transition-colors">
                {solicitud.numero_solicitud ? '✏️' : '➕'}
              </button>
            )}
          </div>
        )}
      </td>

      {/* Estado Solicitud */}
      <td className="px-4 py-4 text-sm">
        {puedeCambiarEstado ? (
          <select
            value={solicitud.estado_solicitud}
            onChange={(e) => handleCambiarEstado('estado_solicitud', e.target.value)}
            className={`px-3 py-2 rounded-lg text-xs font-bold cursor-pointer ${getEstadoColor(solicitud.estado_solicitud)}`}
            disabled={loading}
          >
            <option value="Pendiente">⏳ Pendiente</option>
            <option value="Aprobada">✓ Aprobada</option>
            <option value="Anulada">✕ Anulada</option>
          </select>
        ) : (
          <span className={`px-3 py-2 rounded-lg text-xs font-bold inline-block ${getEstadoColor(solicitud.estado_solicitud)}`}>
            {solicitud.estado_solicitud}
          </span>
        )}
      </td>

      {/* Número de Orden */}
      <td className="px-4 py-4 text-sm">
        {editandoOrden ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={numeroOrden}
              onChange={(e) => setNumeroOrden(e.target.value)}
              className="w-32 px-3 py-2 border-2 border-[#C4181E] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C4181E]"
              placeholder="ORD-XXX"
              autoFocus
            />
            <button onClick={handleAgregarOrden} className="px-3 py-2 bg-[#C4181E] text-white rounded-lg text-xs hover:bg-[#a01419] font-semibold" disabled={loading}>✓</button>
            <button onClick={() => { setEditandoOrden(false); setNumeroOrden(solicitud.numero_orden || ''); }} className="px-3 py-2 bg-gray-400 text-white rounded-lg text-xs hover:bg-gray-500">✕</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {solicitud.numero_orden ? (
              <span className="px-3 py-1 bg-[#C4181E] text-white rounded-lg font-bold text-sm">
                {solicitud.numero_orden}
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-lg text-xs italic">Sin número</span>
            )}
            {puedeEditarNumeros && (
              <button onClick={() => setEditandoOrden(true)} className="text-[#C4181E] hover:text-[#2D4373] transition-colors">
                {solicitud.numero_orden ? '✏️' : '➕'}
              </button>
            )}
          </div>
        )}
      </td>

      {/* Estado Orden */}
      <td className="px-4 py-4 text-sm">
        {puedeCambiarEstado ? (
          <select
            value={solicitud.estado_orden}
            onChange={(e) => handleCambiarEstado('estado_orden', e.target.value)}
            className={`px-3 py-2 rounded-lg text-xs font-bold cursor-pointer ${getEstadoColor(solicitud.estado_orden)}`}
            disabled={loading}
          >
            <option value="Pendiente">⏳ Pendiente</option>
            <option value="Aprobada">✓ Aprobada</option>
            <option value="Anulada">✕ Anulada</option>
          </select>
        ) : (
          <span className={`px-3 py-2 rounded-lg text-xs font-bold inline-block ${getEstadoColor(solicitud.estado_orden)}`}>
            {solicitud.estado_orden}
          </span>
        )}
      </td>

      <td className="px-4 py-4 text-sm text-gray-600">{solicitud.creado_por}</td>
      <td className="px-4 py-4 text-sm text-gray-500">{formatFecha(solicitud.fecha_creacion)}</td>

      <td className="px-4 py-4 text-sm">
        <div className="flex gap-2">
          {solicitud.estado_orden === 'Aprobada' && (
            <button onClick={handleGenerarReporte} className="px-3 py-2 bg-[#2D4373] text-white rounded-lg text-xs hover:bg-[#1e2d4f] font-semibold shadow-sm" title="Generar Reporte">
              📄 PDF
            </button>
          )}
          {puedeEliminar && (
            <button onClick={handleEliminar} className="px-3 py-2 bg-[#C4181E] text-white rounded-lg text-xs hover:bg-[#a01419] font-semibold shadow-sm" disabled={loading} title="Eliminar">
              🗑️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default SolicitudRow;
