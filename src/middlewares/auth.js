const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { User } = require('../models/index');

const protect = async (req, res, next) => {
    try {
        let token;

        // Proveri da li token postoji u headeru
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ApiError(401, 'Not authorized to access this route');
        }

        // Verifikuj token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Nadji usera
        req.user = await User.findByPk(decoded.id);

        if (!req.user) {
            throw new ApiError(401, 'User no longer exists');
        }

        next();
    } catch (error) {
        next(new ApiError(401, 'Not authorized to access this route'));
    }
};

// Provera role (admin, librarian, member)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, `Role ${req.user.role} is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { protect, authorize };    