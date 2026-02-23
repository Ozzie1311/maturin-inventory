// Middleware para autorización por rol
module.exports = function(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== requiredRole) {
      return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes.' });
    }
    next();
  };
};
