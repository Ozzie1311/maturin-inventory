const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const userController = require('../controllers/userController')

// Registro
router.post(
    '/register',
    [
        body('nombre').notEmpty().withMessage('El nombre es requerido'),
        body('email').isEmail().withMessage('Email inválido'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('rol')
            .optional()
            .isIn(['admin', 'usuario'])
            .withMessage('Rol inválido'),
    ],
    userController.register,
)
// Login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email inválido'),
        body('password').notEmpty().withMessage('La contraseña es requerida'),
    ],
    userController.login,
)

module.exports = router
