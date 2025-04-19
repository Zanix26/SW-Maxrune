const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Korrektur: Leerzeichen nach "Bearer"
    if (!token) {
        return res.status(401).json({ message: 'Kein Token bereitgestellt.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Ungültiger Token.', error });
    }
};

module.exports = authMiddleware;