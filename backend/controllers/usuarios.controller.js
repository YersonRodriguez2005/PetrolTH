const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Obtener todos los usuarios
const getAllUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, usuario, rol, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      message: 'Error al obtener usuarios',
      error: error.message 
    });
  }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      'SELECT id, usuario, rol, fecha_creacion FROM usuarios WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      message: 'Error al obtener usuario',
      error: error.message 
    });
  }
};

// Crear nuevo usuario
const createUsuario = async (req, res) => {
  try {
    const { usuario, password, rol } = req.body;

    // Verificar si el usuario ya existe
    const [existing] = await db.query(
      'SELECT * FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        message: 'El nombre de usuario ya existe' 
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await db.query(
      'INSERT INTO usuarios (usuario, password, rol) VALUES (?, ?, ?)',
      [usuario, hashedPassword, rol || 'Usuario']
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      message: 'Error al crear usuario',
      error: error.message 
    });
  }
};

// Actualizar usuario
const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, password, rol } = req.body;

    // Verificar que el usuario existe
    const [existing] = await db.query(
      'SELECT * FROM usuarios WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Construir query dinámicamente
    let updateFields = [];
    let values = [];

    if (usuario) {
      // Verificar que el nuevo nombre de usuario no esté en uso
      const [duplicate] = await db.query(
        'SELECT * FROM usuarios WHERE usuario = ? AND id != ?',
        [usuario, id]
      );

      if (duplicate.length > 0) {
        return res.status(400).json({ 
          message: 'El nombre de usuario ya está en uso' 
        });
      }

      updateFields.push('usuario = ?');
      values.push(usuario);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }

    if (rol) {
      updateFields.push('rol = ?');
      values.push(rol);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ 
        message: 'No hay campos para actualizar' 
      });
    }

    values.push(id);
    const query = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await db.query(query, values);

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      message: 'Error al actualizar usuario',
      error: error.message 
    });
  }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM usuarios WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      message: 'Error al eliminar usuario',
      error: error.message 
    });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
};