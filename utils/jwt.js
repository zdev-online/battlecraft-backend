const config    = require('../config.json');
const jwt       = require('jsonwebtoken');

module.exports.getToken = (data) => jwt.sign(data, config.jwtSecret, { expiresIn: "604800000" });

module.exports.checkToken = (token) => jwt.verify(token, config.jwtSecret);