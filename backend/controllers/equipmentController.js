const Equipment = require('../models/equipmentModel')

const getAll = async (req, res, next) => {
    try {
        const totalInventory = await Equipment.find({})
        res.json({
            message: 'Inventario obtenido correctamente',
            data: totalInventory,
        })
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    const {
        name,
        category,
        brand,
        model,
        serialNumber,
        status,
        location,
        stock,
    } = req.body

    try {
        const newEquipment = new Equipment({
            name,
            category,
            brand,
            model,
            serialNumber,
            status,
            location,
            stock,
        })

        const savedEquipment = await newEquipment.save()
        res.status(201).json({
            message: 'Equipo creado correctamente',
            data: savedEquipment,
        })
    } catch (error) {
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const item = await Equipment.findById(req.params.id)
        if (item) {
            res.json({ message: 'Equipo encontrado', data: item })
        } else {
            res.status(404).json({ error: 'Equipo no encontrado' })
        }
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const updatedEquipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true },
        )
        if (!updatedEquipment) {
            return res.status(404).json({ error: 'Equipo no encontrado' })
        }
        res.json({
            message: 'Equipo actualizado correctamente',
            data: updatedEquipment,
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const deletedEquipment = await Equipment.findByIdAndDelete(
            req.params.id,
        )
        if (!deletedEquipment) {
            return res.status(404).json({ error: 'Equipo no encontrado' })
        }
        res.json({
            message: 'Equipo eliminado correctamente',
            data: deletedEquipment,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { getAll, create, getById, update, remove }
