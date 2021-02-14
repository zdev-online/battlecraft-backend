module.exports = (req, res, next) => {
    if(!req.token){ return next(); }
    return res.stauts(403).json({ message: 'You already authed!' });
}