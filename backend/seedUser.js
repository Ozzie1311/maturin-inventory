const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const User = require('./models/userModel')

const seedUser = async () => {
    await mongoose.connect(process.env.MONGODB_URI)

    // Borra usuarios previos para evitar duplicados
    await User.deleteMany({})

    const hashedPassword = await bcrypt.hash('admin1234', 10)

    await User.create([
        {
            nombre: 'Administrador',
            email: 'admin@maturin.com',
            password: hashedPassword,
            rol: 'admin',
        },
        {
            nombre: 'Usuario Demo',
            email: 'usuario@maturin.com',
            password: await bcrypt.hash('usuario1234', 10),
            rol: 'usuario',
        },
    ])

    console.log('✅ Usuarios creados correctamente')
    console.log('  📧 admin@maturin.com     🔑 admin1234   (admin)')
    console.log('  📧 usuario@maturin.com   🔑 usuario1234 (usuario)')

    mongoose.connection.close()
}

seedUser()
