module.exports = (req, res, next) => {
    if(!req.headers.authorization){
        req.token = false;
        return next();
    }
    let token = req.headers.authorization.replace('Bearer ', '');
    req.token = token.length ? token : false;
    return next();  
}