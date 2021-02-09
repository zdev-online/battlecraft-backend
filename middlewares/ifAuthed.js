const jwt   = require('../utils/jwt');

module.exports = (req, res, next) => {
    if(!req.token){ return res.status(401).json({ message: "Invalid token"}); }    
    try {
        let info = jwt.checkToken(req.token);
        req.user = info;
        return next();
    } catch(error){
        return res.status(401).json({ message: "Invalid token"});
    }
}