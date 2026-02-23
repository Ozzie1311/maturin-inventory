const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Networking', 'CCTV', 'Perifericos', 'Computación', 'Telefonía'],
    },
    brand: String,
    model: String,
    serialNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      default: 'Disponible',
      enum: ['Disponible', 'En uso', 'Reparación', 'Dañado'],
    },
    location: {
      type: String,
      default: 'Deposito Central',
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    observations: String,
  },
  { timestamps: true },
)

module.exports = mongoose.model('Equipment', equipmentSchema)
