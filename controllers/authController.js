const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const register = (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    userModel.findUserByUsername(username, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Failed to hash password:', err);
                return res.status(500).json({ error: 'Failed to hash password' });
            }

            // Create the user
            userModel.createUser(username, hashedPassword, (err, result) => {
                if (err) {
                    console.error('Failed to register user:', err);
                    return res.status(500).json({ error: 'Failed to register user' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
};


const login = (req, res) => {
    const { username, password } = req.body;

    // Find the user
    userModel.findUserByUsername(username, (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Store the token in the database
            userModel.updateUserToken(user.username, token, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to store token' });
                }
                res.json({ message: 'Logged in successfully', token });
            });
        });
    });
};

const logout = (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Find the user by token
    userModel.findUserByToken(token, (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = results[0];

        // Remove the token
        userModel.removeUserToken(user.username, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to remove token' });
            }
            res.json({ message: 'Logged out successfully' });
        });
    });
};

module.exports = {
    register,
    login,
    logout
};
