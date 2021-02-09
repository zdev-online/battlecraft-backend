const _route    = require('express').Router();
const User      = require('../database/models/User');
const Temp2fa   = require('../database/models/Temp2fa');
const jwt       = require('../utils/jwt');
const tfa       = require('../utils/2fa');
const mailer    = require('../utils/mailer');
const { Op }    = require('sequelize');

_route.post('/:id', (req, res) => {
    try {
        let user = await User.findOne({ where: { id: req.params.id } });
        if(!user){ return res.status(404).json({ message: 'User not found!' }); }
        delete user.password;
        delete user.donateMoney;
        delete user.username;
        delete user.tfaType;
        delete user.tfaSecret;
        delete user.emailCode;
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Сменить пароль
_route.post('/changepassword', async (req, res) => {
    try {
        if(!req.body){ return res.status(400).json({ message: 'Password empty' }); }
        if(!req.body.new_password){ return res.status(400).json({ message: 'Password invalid' }); }
        if(!req.body.new_password){ return res.status(400).json({ message: 'Password invalid' }); }
        if(!req.body.old_password){ return res.status(400).json({ message: 'Old Password empty' }); }
        if(!req.body.old_password.length){ return res.status(400).json({ message: 'Old Password invalid' }); }
        if(!req.body.old_password_accept){ return res.status(400).json({ message: 'Old Password invalid' }); }
        if(!req.body.old_password_accept.length){ return res.status(400).json({ message: 'Old Password invalid' }); }
        if(req.old_password != req.old_password_accept){ return res.status(400).json({ message: "Old password invalid" })}
        let user    = await User.findOne({ where: { username: req.user.username } });
        if(user.checkPassword(req.body.new_password)){ return res.status(400).json({ message: "Passwords equals" }); }
        user.password = req.body.new_password;
        await user.save();
        let token   = jwt.getToken({ user: user.toJSON() });
        return res.json({ token, user: user.toJSON() });
    } catch (error) {
        return res.status(500).json({ message: "Couldn't change password" });
    }
});

// Сменить скин
_route.post('/changeskin', (req, res) => {});

// Включить или отключить 2fa
_route.get('/2fa', async (req, res) => {
    try {
        if(!req.query.type){ return res.status(400).json({ message: "Parameter 'type' required" }); }
        let temp2fa = await Temp2fa.findOne({ where: {userId: req.user.id} });
        if(temp2fa){ return res.status(403).json({ message: 'You already get 2fa-confirm-code' }); }
        switch(req.query.type){
            case 'email': {
                // if(!req.query.email || !req.user.email){ return res.status(400).json({ message: "Parameter 'email' required"}); }
                // let code = Math.round(Math.random() * 1000000);
                // let info = await mailer.send(req.query.email,);
                
            }
            case 'google': {
                let data        = await tfa.generateQrCode();
                await Temp2fa.create({
                    userId: req.user.id,
                    type: req.query.type,
                    code: data.secret,
                    expires: new Date().getTime() + 1000 * 60 * 60 * 5
                });
                return res.json({ qrcode: data.imageCode });
            }
            case 'none': {
                let user        = await User.findOne({ where: {id: req.user.id} });
                user.tfaType    = 'none';
                user.tfaSecret  = '';
                return res.json({ message: '2fa auth disabled' });
            }
            default: { return res.status(400).json({ message: "Undefined type 'type'" }) }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Подтверждение включения 2fa-авторизации
_route.post('/2fa/confirm', async (req, res) => {
    try {
        if(!req.body.code){ return res.status(400).json({ message: '2fa-confirm-code required' }) }
        let temp2fa = await Temp2fa.findOne({ where: {userId: req.userId} });
        if(!temp2fa){ return res.status(403).json({ message: "First, get 2fa-confirm-code" }); }
        if(temp2fa.type == 'email'){
            // Сравнить введенный код
        }
        if(temp2fa.type == 'google'){
            let check = tfa.checkCode(req.body.code, temp2fa.code);
            if(check){
                let user        = await User.findOne({ where: {id: req.user.id} });
                user.tfaType    = temp2fa.type;
                user.tfaSecret  = temp2fa.code;
                await user.save();
                return res.json({ message: "TFA Enabled" });
            } else {
                return res.status(400).json({ message: "2fa-confirm-code doesn't match" });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

setInterval(async () => {
    try {
        await Temp2fa.destroy({ 
            where: { 
                expires: {
                    [Op.lte]: new Date().getTime()
                } 
            } 
        });
    } catch (error) {
        console.log(`Не удалось удалить временные 2fa-коды-подтверждения`);
    }
}, 1000 * 60 * 60 * 5);


module.exports = _route;
