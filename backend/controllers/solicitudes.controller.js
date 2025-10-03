const db = require('../config/database');

// Obtener todas las solicitudes (ordenadas por fecha descendente)
const getAllSolicitudes = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM solicitudes_ordenes ORDER BY fecha_creacion DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ 
      message: 'Error al obtener solicitudes',
      error: error.message 
    });
  }
};

// Obtener una solicitud por ID
const getSolicitudById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({ 
      message: 'Error al obtener solicitud',
      error: error.message 
    });
  }
};

// Obtener solicitudes de un usuario específico
const getSolicitudesByUsuario = async (req, res) => {
  try {
    const { usuario } = req.params;
    const [rows] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE creado_por = ? ORDER BY fecha_creacion DESC',
      [usuario]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes del usuario:', error);
    res.status(500).json({ 
      message: 'Error al obtener solicitudes',
      error: error.message 
    });
  }
};

// Crear nueva solicitud
const createSolicitud = async (req, res) => {
  try {
    const { empleado, tipo_solicitud } = req.body;
    const creado_por = req.user.usuario;

    const [result] = await db.query(
      `INSERT INTO solicitudes_ordenes 
       (empleado, tipo_solicitud, estado_solicitud, estado_orden, creado_por, actualizado_por) 
       VALUES (?, ?, 'Pendiente', 'Pendiente', ?, ?)`,
      [empleado, tipo_solicitud, creado_por, creado_por]
    );

    res.status(201).json({
      message: 'Solicitud creada exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ 
      message: 'Error al crear solicitud',
      error: error.message 
    });
  }
};

// Agregar número de orden a una solicitud
const agregarNumeroOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_orden } = req.body;
    const actualizado_por = req.user.usuario;

    // Verificar que la solicitud existe
    const [solicitud] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE id = ?',
      [id]
    );

    if (solicitud.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Verificar que el número de orden no exista ya
    const [existing] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE numero_orden = ? AND id != ?',
      [numero_orden, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        message: 'Este número de orden ya está en uso' 
      });
    }

    // Actualizar número de orden
    await db.query(
      `UPDATE solicitudes_ordenes 
       SET numero_orden = ?, actualizado_por = ?, fecha_actualizacion = NOW() 
       WHERE id = ?`,
      [numero_orden, actualizado_por, id]
    );

    res.json({ message: 'Número de orden agregado exitosamente' });
  } catch (error) {
    console.error('Error al agregar número de orden:', error);
    res.status(500).json({ 
      message: 'Error al agregar número de orden',
      error: error.message 
    });
  }
};

// Cambiar estado de solicitud u orden (solo Admin)
const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado_solicitud, estado_orden } = req.body;
    const actualizado_por = req.user.usuario;

    // Verificar que la solicitud existe
    const [solicitud] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE id = ?',
      [id]
    );

    if (solicitud.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Construir query dinámicamente
    let updateFields = [];
    let values = [];

    if (estado_solicitud) {
      updateFields.push('estado_solicitud = ?');
      values.push(estado_solicitud);
    }

    if (estado_orden) {
      updateFields.push('estado_orden = ?');
      values.push(estado_orden);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        message: 'Debe proporcionar al menos un estado para actualizar' 
      });
    }

    updateFields.push('actualizado_por = ?', 'fecha_actualizacion = NOW()');
    values.push(actualizado_por, id);

    const query = `UPDATE solicitudes_ordenes SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await db.query(query, values);

    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ 
      message: 'Error al cambiar estado',
      error: error.message 
    });
  }
};

// Eliminar solicitud (solo Admin)
const deleteSolicitud = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM solicitudes_ordenes WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.json({ message: 'Solicitud eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    res.status(500).json({ 
      message: 'Error al eliminar solicitud',
      error: error.message 
    });
  }
};

// Generar reporte (solo si la orden está aprobada)
const generarReporte = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const solicitud = rows[0];

    if (solicitud.estado_orden !== 'Aprobada') {
      return res.status(400).json({ 
        message: 'Solo se pueden generar reportes de órdenes aprobadas' 
      });
    }

    res.json({
      message: 'Reporte generado',
      datos: solicitud
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ 
      message: 'Error al generar reporte',
      error: error.message 
    });
  }
};

// Agregar número de solicitud
const agregarNumeroSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_solicitud } = req.body;
    const actualizado_por = req.user.usuario;

    // Verificar que la solicitud existe
    const [solicitud] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE id = ?',
      [id]
    );

    if (solicitud.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Verificar que no esté duplicado
    const [existing] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE numero_solicitud = ? AND id != ?',
      [numero_solicitud, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        message: 'Este número de solicitud ya está en uso' 
      });
    }

    // Actualizar número de solicitud
    await db.query(
      `UPDATE solicitudes_ordenes 
       SET numero_solicitud = ?, actualizado_por = ?, fecha_actualizacion = NOW() 
       WHERE id = ?`,
      [numero_solicitud, actualizado_por, id]
    );

    res.json({ message: 'Número de solicitud agregado exitosamente' });
  } catch (error) {
    console.error('Error al agregar número de solicitud:', error);
    res.status(500).json({ 
      message: 'Error al agregar número de solicitud',
      error: error.message 
    });
  }
};


module.exports = {
  getAllSolicitudes,
  getSolicitudById,
  getSolicitudesByUsuario,
  createSolicitud,
  agregarNumeroSolicitud,
  agregarNumeroOrden,
  cambiarEstado,
  deleteSolicitud,
  generarReporte
};