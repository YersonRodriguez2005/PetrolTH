const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Validar que los middlewares existan
if (typeof verifyToken !== 'function' || typeof isAdmin !== 'function') {
  throw new Error('verifyToken o isAdmin no están definidos correctamente en auth.middleware');
}

// Todas las rutas requieren autenticación de admin
router.use(verifyToken);
router.use(isAdmin);

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', usuariosController.getAllUsuarios);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', usuariosController.getUsuarioById);

// POST /api/usuarios - Crear nuevo usuario (para registros manuales)
router.post('/', usuariosController.createUsuario);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', usuariosController.updateUsuario);

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', usuariosController.deleteUsuario);

module.exports = router;
