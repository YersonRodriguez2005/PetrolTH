const express = require('express');
const router = express.Router();
const solicitudesController = require('../controllers/solicitudes.controller');
const { verifyToken, isAdmin, isOwnerOrAdmin } = require('../middleware/auth.middleware');
const { 
  validateSolicitud, 
  validateNumeroOrden,
  validateNumeroSolicitud, 
  validateEstado 
} = require('../middleware/validators');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// GET /api/solicitudes - Obtener todas las solicitudes
router.get('/', solicitudesController.getAllSolicitudes);

// GET /api/solicitudes/:id - Obtener una solicitud por ID
router.get('/:id', solicitudesController.getSolicitudById);

// GET /api/solicitudes/usuario/:usuario - Obtener solicitudes de un usuario
router.get('/usuario/:usuario', solicitudesController.getSolicitudesByUsuario);

// POST /api/solicitudes - Crear nueva solicitud
router.post('/', validateSolicitud, solicitudesController.createSolicitud);

// PUT /api/solicitudes/:id/numero-solicitud - Agregar/Editar número de solicitud
router.put(
  '/:id/numero-solicitud', 
  validateNumeroSolicitud, 
  solicitudesController.agregarNumeroSolicitud
);

// PUT /api/solicitudes/:id/numero-orden - Agregar/Editar número de orden
router.put(
  '/:id/numero-orden', 
  validateNumeroOrden, 
  solicitudesController.agregarNumeroOrden
);

// PUT /api/solicitudes/:id/estado - Cambiar estado (Solo Admin)
router.put(
  '/:id/estado', 
  isAdmin, 
  validateEstado, 
  solicitudesController.cambiarEstado
);

// DELETE /api/solicitudes/:id - Eliminar solicitud (Solo Admin)
router.delete('/:id', isAdmin, solicitudesController.deleteSolicitud);

// GET /api/solicitudes/:id/reporte - Generar reporte (Solo si está aprobada)
router.get('/:id/reporte', solicitudesController.generarReporte);

module.exports = router;