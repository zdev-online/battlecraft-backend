module.exports = (req, res, next) => {
    if(!req.token){ return next(); }
    return res.status(403).json({ message: 'You already authed!' });
}