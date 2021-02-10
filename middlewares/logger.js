module.exports = (req, res, next) => {
    const state = req.user ? 'loggedIn' : 'quest';
    console.log(`${req.ip} -> ${state} -> ${req.method} -> ${req.path}`);
    return next();
}