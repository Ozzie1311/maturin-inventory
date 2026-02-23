const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

// Registro de usuario
exports.register = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { nombre, email, password, rol } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'El email ya está registrado.' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ nombre, email, password: hashedPassword, rol })
        await user.save()
        res.status(201).json({ message: 'Usuario registrado correctamente.' })
    } catch (error) {
        next(error)
    }
}

// Login de usuario
exports.login = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        const isMatch = user && (await bcrypt.compare(password, user.password))

        // Mismo mensaje para evitar user enumeration
        if (!user || !isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' })
        }

        const token = jwt.sign(
            { userId: user._id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1d' },
        )
        res.json({
            token,
            user: { nombre: user.nombre, email: user.email, rol: user.rol },
        })
    } catch (error) {
        next(error)
    }
}
