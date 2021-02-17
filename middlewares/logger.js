module.exports = (req, res, next) => {
    const state = req.token ? 'loggedIn' : 'quest';
    console.log(`${req.ip} -> ${state} -> ${req.method} -> ${req.path}`);
    return next();
}