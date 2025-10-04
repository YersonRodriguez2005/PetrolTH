const db = require('../config/database');

// Obtener todas las solicitudes (ordenadas por fecha descendente)
const getAllSolicitudes = async (req, res) => {
  try {
    console.log('📋 Obteniendo todas las solicitudes');
    const [rows] = await db.query(
      `SELECT 
        id, 
        empleado, 
        tipo_solicitud, 
        numero_solicitud,
        estado_solicitud, 
        numero_orden,
        estado_orden, 
        fecha_creacion, 
        fecha_actualizacion,
        creado_por, 
        actualizado_por
      FROM solicitudes_ordenes 
      ORDER BY fecha_creacion DESC`
    );
    console.log(`✅ ${rows.length} solicitudes encontradas`);
    console.log('Solicitudes:', rows);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener solicitudes:', error);
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
    console.log(`👤 Obteniendo solicitudes de: ${usuario}`);
    const [rows] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE creado_por = ? ORDER BY fecha_creacion DESC',
      [usuario]
    );
    console.log(`✅ ${rows.length} solicitudes encontradas para ${usuario}`);
    console.log('Solicitudes:', rows);
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
    const { empleado, tipo_solicitud, numero_solicitud } = req.body;
    const creado_por = req.user.usuario;

    console.log('📝 Creando nueva solicitud:', { 
      empleado, 
      tipo_solicitud, 
      numero_solicitud,
      creado_por 
    });

    // Si se proporciona número de solicitud, verificar que no exista
    if (numero_solicitud && numero_solicitud.trim() !== '') {
      const [existing] = await db.query(
        'SELECT * FROM solicitudes_ordenes WHERE numero_solicitud = ?',
        [numero_solicitud]
      );

      if (existing.length > 0) {
        console.log('⚠️ Número de solicitud duplicado');
        return res.status(400).json({ 
          message: 'Este número de solicitud ya está en uso' 
        });
      }
    }

    const [result] = await db.query(
      `INSERT INTO solicitudes_ordenes 
       (empleado, tipo_solicitud, numero_solicitud, estado_solicitud, estado_orden, creado_por, actualizado_por) 
       VALUES (?, ?, ?, 'Pendiente', 'Pendiente', ?, ?)`,
      [empleado, tipo_solicitud, numero_solicitud || null, creado_por, creado_por]
    );

    console.log('✅ Solicitud creada con ID:', result.insertId);
    
    // Obtener la solicitud recién creada para devolverla completa
    const [solicitudCreada] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE id = ?',
      [result.insertId]
    );
    
    console.log('📤 Enviando solicitud creada:', solicitudCreada[0]);

    res.status(201).json({
      message: 'Solicitud creada exitosamente',
      id: result.insertId,
      solicitud: solicitudCreada[0]
    });
  } catch (error) {
    console.error('❌ Error al crear solicitud:', error);
    res.status(500).json({ 
      message: 'Error al crear solicitud',
      error: error.message 
    });
  }
};

// Agregar número de solicitud a una solicitud
const agregarNumeroSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_solicitud } = req.body;
    const actualizado_por = req.user.usuario;

    console.log(`🔢 Actualizando número de solicitud ${id}:`, numero_solicitud);
    console.log('Usuario que actualiza:', actualizado_por);

    // Verificar que la solicitud existe
    const [solicitud] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE id = ?',
      [id]
    );

    if (solicitud.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Verificar que el número de solicitud no exista ya (excepto en esta misma solicitud)
    const [existing] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE numero_solicitud = ? AND id != ?',
      [numero_solicitud, id]
    );

    if (existing.length > 0) {
      console.log('⚠️ Número de solicitud ya existe');
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

    console.log('✅ Número de solicitud actualizado');
    res.json({ message: 'Número de solicitud actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error al agregar número de solicitud:', error);
    res.status(500).json({ 
      message: 'Error al agregar número de solicitud',
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

    console.log(`🔢 Actualizando número de orden ${id}:`, numero_orden);

    // Verificar que la solicitud existe
    const [solicitud] = await db.query(
      'SELECT * FROM solicitudes_ordenes WHERE id = ?',
      [id]
    );

    if (solicitud.length === 0) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    // Verificar que el número de orden no exista ya (excepto en esta misma solicitud)
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

    console.log('✅ Número de orden actualizado');
    res.json({ message: 'Número de orden actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error al agregar número de orden:', error);
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
    const rol = req.user.rol;

    console.log(`⚙️ Cambiando estado - Usuario: ${actualizado_por}, Rol: ${rol}`);
    console.log(`Solicitud ID: ${id}`);
    console.log(`Nuevos estados:`, { estado_solicitud, estado_orden });

    // Verificar que el usuario es administrador
    if (rol !== 'Administrador') {
      console.log('❌ Usuario no es administrador');
      return res.status(403).json({ 
        message: 'Solo los administradores pueden cambiar estados' 
      });
    }

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
      console.log(`  📌 Estado solicitud → ${estado_solicitud}`);
    }

    if (estado_orden) {
      updateFields.push('estado_orden = ?');
      values.push(estado_orden);
      console.log(`  📌 Estado orden → ${estado_orden}`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        message: 'Debe proporcionar al menos un estado para actualizar' 
      });
    }

    updateFields.push('actualizado_por = ?', 'fecha_actualizacion = NOW()');
    values.push(actualizado_por, id);

    const query = `UPDATE solicitudes_ordenes SET ${updateFields.join(', ')} WHERE id = ?`;
    
    console.log('Ejecutando query:', query);
    console.log('Con valores:', values);
    
    await db.query(query, values);

    console.log('✅ Estado actualizado exitosamente');
    res.json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('❌ Error al cambiar estado:', error);
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