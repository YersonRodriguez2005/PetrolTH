const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Login de usuario
const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    console.log('🔐 Intento de login:', { usuario, passwordLength: password?.length });

    // Buscar usuario en la base de datos
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    console.log('📊 Usuarios encontrados:', rows.length);

    if (rows.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    const user = rows[0];
    console.log('👤 Usuario encontrado:', { id: user.id, usuario: user.usuario, rol: user.rol });

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔑 Contraseña válida:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ 
        message: 'Usuario o contraseña incorrectos' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        usuario: user.usuario, 
        rol: user.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    console.log('✅ Login exitoso, token generado');

    // Enviar respuesta
    res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id: user.id,
        usuario: user.usuario,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error('💥 Error en login:', error);
    res.status(500).json({ 
      message: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

// Logout (opcional - el token simplemente se descarta en el cliente)
const logout = (req, res) => {
  res.json({ message: 'Logout exitoso' });
};

module.exports = {
  login,
  logout
};