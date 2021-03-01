module.exports = (role) => {
    return (req, res, next) => {
        if(req.user.role == 'user'){ return res.status(403).json({ message: "Доступ запрещен", message_en: "Access denied"}); }
        if(!role){ return next(); }
        if(role == 'admin' && req.user.role == 'admin'){ return next(); }
        if(role == 'moder' && req.user.role == 'moder'){ return next(); }
        return res.status(403).json({ message: "Доступ запрещен", message_en: "Access denied"});
    }
}