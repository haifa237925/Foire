// middleware/roles.js
const ErrorResponse = require('../utils/errorResponse');

exports.requireAuthor = (req, res, next) => {
  if (req.user.role !== 'author' && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Seuls les auteurs peuvent accéder à cette fonctionnalité', 403)
    );
  }
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Seuls les administrateurs peuvent accéder à cette fonctionnalité', 403)
    );
  }
  next();
};