const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validaciones para login
const validateLogin = [
  body('usuario')
    .trim()
    .notEmpty().withMessage('El usuario es requerido')
    .isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  handleValidationErrors
];

// Validaciones para crear solicitud
const validateSolicitud = [
  body('empleado')
    .trim()
    .notEmpty().withMessage('El nombre del empleado es requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('tipo_solicitud')
    .notEmpty().withMessage('El tipo de solicitud es requerido')
    .isIn(['Examen', 'Cursos', 'Dotación', 'Otros']).withMessage('Tipo de solicitud no válido'),
  handleValidationErrors
];

const validateNumeroSolicitud = [
  body('numero_solicitud')
    .notEmpty().withMessage('El número de solicitud es obligatorio')
    .isString().withMessage('El número de solicitud debe ser texto')
];

// Validaciones para actualizar número de orden
const validateNumeroOrden = [
  body('numero_orden')
    .trim()
    .notEmpty().withMessage('El número de orden es requerido')
    .isLength({ min: 1, max: 50 }).withMessage('El número de orden debe tener máximo 50 caracteres'),
  handleValidationErrors
];

// Validaciones para cambiar estado
const validateEstado = [
  body('estado_solicitud')
    .optional()
    .isIn(['Pendiente', 'Aprobada', 'Anulada']).withMessage('Estado de solicitud no válido'),
  body('estado_orden')
    .optional()
    .isIn(['Pendiente', 'Aprobada', 'Anulada']).withMessage('Estado de orden no válido'),
  handleValidationErrors
];

module.exports = {
  validateLogin,
  validateSolicitud,
  validateNumeroSolicitud,
  validateNumeroOrden,
  validateEstado
};