const _route        = require('express').Router();
const _ifNotAuthed  = require('../middlewares/ifNotAuthed');
const _ifAuthed     = require('../middlewares/ifAuthed');
const User          = require('../database/models/User');
const jwt           = require('../utils/jwt');

// Регистрация
_route.post('/signup', _ifNotAuthed, async (req, res) => {
    try {
        if(!req.body){ return res.status(400).json({ message: 'Empty username or password' }); }
        if(!req.body.username || !req.body.password){ return res.status(400).json({ message: 'Empty username or password' }); }
        if(!req.body.username.length || !req.body.password.length){ return res.status(400).json({ message: 'Empty username or password' }); }
        let user    = await User.create({ username: req.body.username, password: req.body.password });
        let token   = jwt.getToken(user.toJSON());
        return res.json({ token, user: user.toJSON() });
    } catch (error){
        if(error.code){ return res.status(error.code).json({ message: error.message }) }
        return res.status(500).json({ message: 'Server error' });
    }
});

// Авторизация
_route.post('/signin', _ifNotAuthed, async (req, res) => {
    try {
        if(!req.body){ return res.status(400).json({ message: 'Wrong username or password' }); }
        if(!req.body.username || !req.body.password){ return res.status(400).json({ message: 'Wrong username or password' }); }
        if(!req.body.username.length || !req.body.password.length){ return res.status(400).json({ message: 'Wrong username or password' }); }
        let user = await User.findOne({ where: { username: req.body.username } });
        if(!user){ return res.status(404).json({ message: 'Wrong username or password'}); }
        if(!user.validatePassword(req.body.password)){ return res.status(400).json({ message: 'Wrong username or password' }); }
        let token = jwt.getToken(user.toJSON());
        if(user.totp){ return res.redirect(307, '/auth/2fa'); }
        return res.json({ token, user: user.toJSON() });
    } catch(error){
        return res.status(500).json({ message: 'Server error' });
    }
});

// Выход
_route.post('/logout', _ifAuthed, (req, res) => { return res.json({ message: 'You are logged out' }) });

// Получение информации о пользователе
_route.get('/user', _ifAuthed, (req, res) => { 
    try {
        let user = jwt.checkToken(req.token);
        return res.json({ user, token: req.token }); 
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

_route.post('/2fa', _ifNotAuthed, async (req, res) => {
    try {
        if(!req.body.code){ return res.status(400).json({ message: 'Invalid code' }); }
        // Проверять qr code
        const token = "";
        const user = {};
        return res.json({ user, token });
    } catch(error) {
        return res.status(500).json({ message: "Server error "});
    }
});

module.exports = _route;