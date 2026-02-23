const equipmentRouter = require('express').Router()
const equipmentController = require('../controllers/equipmentController')
const authMiddleware = require('../utils/authMiddleware')
const roleMiddleware = require('../utils/roleMiddleware')

equipmentRouter.get('/', authMiddleware, equipmentController.getAll)
equipmentRouter.get('/:id', authMiddleware, equipmentController.getById)
equipmentRouter.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    equipmentController.create,
)
equipmentRouter.put(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    equipmentController.update,
)

equipmentRouter.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    equipmentController.remove,
)

module.exports = equipmentRouter
