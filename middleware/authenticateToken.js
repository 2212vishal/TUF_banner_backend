const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token.' });
        }

        userModel.findUserByToken(token, (err, results) => {
            if (err || results.length === 0) {
                return res.status(401).json({ error: 'Invalid token.' });
            }

            req.user = decoded;  // Store the decoded token in the request object
            next();
        });
    });
};

module.exports = authenticateToken;
