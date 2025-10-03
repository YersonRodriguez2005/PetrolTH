const jwt = require('jsonwebtoken');

// Verificar token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Verificar rol de administrador
const isAdmin = (req, res, next) => {
  if (req.user.rol !== 'Administrador') {
    return res.status(403).json({ 
      message: 'Acceso denegado. Se requieren permisos de administrador' 
    });
  }
  next();
};

// Verificar que el usuario es dueño del recurso o es admin
const isOwnerOrAdmin = (req, res, next) => {
  const usuarioParam = req.params.usuario || req.body.creado_por;
  
  if (req.user.rol === 'Administrador' || req.user.usuario === usuarioParam) {
    next();
  } else {
    return res.status(403).json({ 
      message: 'No tienes permisos para acceder a este recurso' 
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isOwnerOrAdmin
};