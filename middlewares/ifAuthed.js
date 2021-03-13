const jwt           = require('../utils/jwt');
const errorHelper   = require('../utils/errorHear');

module.exports = async (req, res, next) => {
    try {
        if(!req.token){ return res.status(400).json({ message: "Неверный токен", message_en: 'Invalid token'}); }    
        req.user    = jwt.checkToken(req.token);
        return next();
    } catch(error){ return errorHelper.hear(res, error); }
}