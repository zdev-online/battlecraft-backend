module.exports = (req, res, next) => {
    let token = req.headers.authorization.replace('Bearer ', '');
    req.token = token.length ? token : false;
    return next();  
}