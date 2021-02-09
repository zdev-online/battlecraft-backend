const config    = require('../config.json');
const jwt       = require('jsonwebtoken');

module.exports.getToken = (data) => jwt.sign(data, config.jwtSecret);

module.exports.checkToken = (token) => jwt.verify(token, config.jwtSecret);