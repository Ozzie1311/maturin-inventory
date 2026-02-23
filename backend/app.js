const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const {
    requestLogger,
    unknownEndpoint,
    errorHandler,
} = require('./utils/middleware')

const equipmentRouter = require('./routes/equipmentRoutes')
const userRouter = require('./routes/userRoutes')
mongoose.set('strictQuery', false)

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ ¡Conexión exitosa a MongoDB Atlas!'))
    .catch((err) => console.error('Error conectando a MongoDB: ', err))

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/inventario', equipmentRouter)
app.use('/api/users', userRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
