const mongoose = require('mongoose')
require('dotenv').config()
const Equipment = require('./models/equipmentModel')

const initialEquipment = [
    {
        name: 'Mouse Óptico USB',
        category: 'Periféricos',
        brand: 'Logitech',
        model: 'M100',
        stock: 15,
    },
    {
        name: 'Switch 24 Puertos',
        category: 'Networking',
        brand: 'Reyee',
        model: 'RG-NBS3100',
        status: 'Disponible',
    },
    {
        name: 'Cámara Domo 4MP',
        category: 'CCTV',
        brand: 'Hikvision',
        model: 'DS-2CD1143G0',
        stock: 8,
    },
    {
        name: 'Router Wi-Fi 6',
        category: 'Networking',
        brand: 'TP-Link',
        model: 'Archer AX10',
        status: 'En uso',
        location: 'Oficina Gerencia',
    },
    {
        name: 'NVR 8 Canales',
        category: 'CCTV',
        brand: 'Dahua',
        model: 'NVR4108',
        status: 'Reparación',
    },
]

const seedDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI)
    await Equipment.deleteMany({})
    await Equipment.insertMany(initialEquipment)
    console.log('✅ Base de datos poblada con éxito')
    mongoose.connection.close()
}

seedDB()
