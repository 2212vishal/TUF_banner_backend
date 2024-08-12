const db = require('../config/db');

const createUser = (username, password, callback) => {
    console.log(password);
    const sql = 'INSERT INTO user (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err);
        }
        callback(null, result);
    });
};

const findUserByUsername = (username, callback) => {
    const sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql, [username], callback);
};

const updateUserToken = (username, token, callback) => {
    const sql = 'UPDATE user SET token = ? WHERE username = ?';
    db.query(sql, [token, username], callback);
};

const removeUserToken = (username, callback) => {
    const sql = 'UPDATE user SET token = NULL WHERE username = ?';
    db.query(sql, [username], callback);
};

const findUserByToken = (token, callback) => {
    const sql = 'SELECT * FROM user WHERE token = ?';
    db.query(sql, [token], callback);
};

module.exports = {
    createUser,
    findUserByUsername,
    updateUserToken,
    removeUserToken,
    findUserByToken
};
