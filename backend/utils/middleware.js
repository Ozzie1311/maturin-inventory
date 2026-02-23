const { info, error: errorLogger } = require('./logger')

const requestLogger = (req, res, next) => {
    info('Method: ', req.method)
    info('Path: ', req.path)
    info('Body: ', req.body)
    next()
}

const unknownEndpoint = (req, res) => {
    return res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    errorLogger(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    // Manejo genérico
    return res.status(500).json({ error: 'Error interno del servidor' })
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }
