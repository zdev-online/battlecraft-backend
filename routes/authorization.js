const _route            = require('express').Router();
const _ifNotAuthed      = require('../middlewares/ifNotAuthed');
const _ifAuthed         = require('../middlewares/ifAuthed');
const User              = require('../database/models/User');
const jwt               = require('../utils/jwt');
const tfa               = require('../utils/2fa');
const mailer            = require('../utils/mailer');
const errorHelper       = require('../utils/errorHear');
const { Op }            = require('sequelize');

// Регистрация
_route.post("/signup", _ifNotAuthed, async (req, res) => {
    try {
        if(!req.body.email){ return res.status(400).json({message: 'Не указан E-Mail', message_en: 'No E-Mail specified'})}
        if(!req.body.login){ return res.status(400).json({message: 'Не указан логин', message_en: 'No username specified'})}
        
        let accountNotFree = await User.findOne({where: { [Op.or]: [{email: req.body.email}, {login: req.body.login}]  }});
        if(accountNotFree){ return res.status(403).json({ message: 'E-Mail или логин уже зарегистрованы', message_en: 'Your E-Mail or username is already registered'})}
        
        if(!req.body.password){ return res.status(400).json({message: 'Не указан пароль', message_en: 'A password is not specified'})}
        if(!req.body.password_confirm){ return res.status(400).json({message: 'Подтвердите пароль', message_en: 'Confirm your password'})}
        
        let { email, login, password, password_confirm } = req.body;
        password            = String(password);
        password_confirm    = String(password_confirm);

        if(password.length < 8 || password.length > 30){  return res.status(400).json({ message: 'Пароль не может быть больше 30 и меньше 8 символов', message_en: "The password can not be more than 30 and less than 8 characters"}) }
        if(password != password_confirm){ return res.status(400).json({message: 'Пароли не совпадают', message_en: 'Passwords don`t match'})}
        
        let user        = await User.create({ email, login, password });
        let token       = jwt.getToken(user.toJSON());
        return res.json({ token });
    } catch (error) { return errorHelper.hear(res, error); }
});

// Авторизация
_route.post('/signin', _ifNotAuthed, async (req, res) => {
    try {
        if(!req.body.email){ return res.status(400).json({message: 'Не указан E-Mail', message_en: 'No E-Mail specified'})}
        if(!req.body.password){ return res.status(400).json({message: 'Не указан пароль', message_en: 'A password is not specified'})}
        
        let { email, password } = req.body;
        let user    = await User.findOne({where: { email }});
        if(!user){ return res.status(404).json({message: 'Пользователь не найден', message_en: "User not found"}) }
        if(!user.isValidPassword(String(password))){ return res.status(400).json({message: 'Неверный пароль', message_en: "Invalid password"}); }
        if(user.tfaType != 'none'){ return res.json({ tfa: true, tfaType: user.tfaType }) }
        let token   = jwt.getToken(user.toJSON());
        return res.json({ token, tfa: false });
    } catch (error) { return errorHelper.hear(res, error); }
});

// Получение данных пользователя
_route.get('/user', _ifAuthed, async (req, res) => {
    try {
        let user    = await User.findOne({ where: { email: req.user.email }});
        user        = user.toJSON();
        let token   = jwt.getToken(user);
        delete user.password;
        delete user.emailCode;
        delete user.tfaSecret;
        return res.json({ user, token });
    } catch (error) { return errorHelper.hear(res, error); }
});

// Двухфакторная аутентификация
_route.post('/2fa', _ifNotAuthed, async (req, res) => {
    try {
        if(!req.body.email){ return res.status(400).json({message: 'Не указан E-Mail', message_en: 'No E-Mail specified'})}
        if(!req.body.password){ return res.status(400).json({message: 'Не указан пароль', message_en: 'A password is not specified'})}
        if(!req.body.code){ return res.status(400).json({ message: 'Код неверный', message_en: "Invalid code"}) }
        
        let { email, password, code } = req.body;
        let user = await User.findOne({where: { email }});
        if(!user){ return res.status(404).json({message: 'Пользователь не найден', message_en: "User not found"}) }
        if(user.tfaType == 'none'){ return res.status(400).json({ message: "2FA выключена", message_en: "2FA disabled"});}
        if(!user.isValidPassword(password)){ return res.status(400).json({message: 'Неверный пароль', message_en: "Invalid password"}) }
        
        if(user.tfaType == 'google'){
            if(!tfa.checkCode(code, user.tfaSecret)){
                return res.status(400).json({ message: 'Код неверный', message_en: "Invalid code"});
            }
        }
        if(user.tfaType == 'email'){
            if(code != user.emailCode){
                return res.status(400).json({ message: 'Код неверный', message_en: "Invalid code"});
            }
        }
        let token   = jwt.getToken(user.toJSON());
        return res.json({ token });
    } catch (error) { return errorHelper.hear(req, error); }
});

// Авторизация для лаунчера ( p.s не важен для фронта )
_route.post('/launcher', async (req, res) => {
    try {
        if(!req.body.username){ return res.status(400).json({ error: 'Неверный логин' }); }
        if(!req.body.password){ return res.status(400).json({ error: 'Неверный пароль' }); }
        let {  username:email, password } = req.body;
        let user = await User.findOne({ where: { email } });
        if(!user){ return res.status(400).json({ error: "Аккаунт не найден" }); }
        if(!user.isValidPassword(password)){ return res.status(400).json({ error: 'Неверный пароль' }); }
        return res.json({ username: user.login, permissions: 0 });
    } catch (error) {
        return res.status(500).json({ error: "Ошибка сервера..." });
    }
});

module.exports = _route;