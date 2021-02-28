const _route        = require('express').Router();
const path          = require('path');
const multer        = require('multer');
const errorHelper   = require('../utils/errorHear');
const tfa           = require('../utils/2fa');
const jwt           = require('../utils/jwt');
const User          = require('../database/models/User');
const Temp2fa       = require('../database/models/Temp2fa');

// Запрос на добавление \ сброс 2-х факторной аунтентификации
_route.get('/2fa', async (req, res) => {
    try {
        if(!req.query.type){ return res.status(400).json({ message: "Не указан тип 2FA", message_en: "2FA type not specified"}); }
        
        let { type }    = req.query;
        let user        = await User.findOne({where: { email: req.user.email }});
        switch (type) {
            case 'google': { 
                // 2FA по Google-Auth
                let data    = await tfa.generateQrCode();
                // Временное хранилище подтверждения 2fa
                await Temp2fa.create({
                    userId: req.user.id,
                    tfaType: 'google',
                    tfaCode: data.secret,
                    // 5 минут на подтверждение
                    expires: new Date().getTime() + 300000
                })
                return res.json({ qrcode: data.imageCode });
            }
            case 'email': {
                // 2FA по E-Mail
                let code    = Math.round(Math.random() * 1000000);
                // Временное хранилище подтверждения 2fa
                return res.json({ email: req.user.email });
            }   
            case 'none': {
                // Сброс 2FA
                user.tfaType    = 'none';
                user.tfaSecret  = '';
                user.emailCode  = 0;
                await user.save();
                user = user.toJSON();
                let token       = jwt.getToken(user);
                delete user.tfaSecret;
                delete user.emailCode;
                delete user.password;
                return res.json({ token, user });
            }
            default: return res.status(404).json({ message: "Неизвеcтный 2FA тип", message_en: "Unknown 2FA type" });                      
        }
    } catch (error) { return errorHelper.hear(res, error) }
});

// Подтверждения запроса на 2-х факторную аунтентификацию
_route.post('/2fa/confirm', async (req, res) => {
    try {
        if(!req.body.code){ return res.status(400).json({ message: 'Неверный код подтверждения', message_en: "Invalid confirm code"}); }
        let temp2fa = await Temp2fa.findOne({ where: { userId: req.user.id }});
        if(!temp2fa){ return res.status(404).json({ message: "Запроса на 2FA активацию не было", message_en: "No request to activate 2-factor authorization"});}
        if(temp2fa.tfaType == 'google'){
            if(!tfa.checkCode(req.body.code, temp2fa.tfaCode)){ return res.status(400).json({ message: 'Неверный код подтверждения', message_en: "Invalid confirm code"}); }
            let user = await User.findOne({ where: { id: req.user.id }});
            user.tfaType    = temp2fa.tfaType;
            user.tfaSecret  = temp2fa.tfaCode;
            await user.save();
            await Temp2fa.destroy({ where: { userId: req.user.id }});
            user = user.toJSON();
            let token = jwt.getToken(user);
            delete user.tfaSecret;
            delete user.emailCode;
            delete user.password;
            return res.json({ token, user });
        }
    } catch (error) { return errorHelper.hear(res, error) }
});

// Смена пароля
_route.post('/change/password', async (req, res) => {
    try {
        if(!req.body.password){ return res.status(400).json({ message: 'Не указан текущий пароль', message_en: 'The current password is not specified'}); }
        if(!req.body.new_password){ return res.status(400).json({ message: 'Не указан новый пароль', message_en: 'The new-password is not specified'}); }
        if(!req.body.new_password_accept){ return res.status(400).json({ message: 'Не указан подтверждающий пароль', message_en: 'Confirmation password not specified'}); }
        
        let { password, new_password, new_password_accept } = req.body;
        if(new_password != new_password_accept){ return res.status(400).json({ message: 'Пароли не совпадают', message_en: "Passwords don't match"})}
        if(new_password.length < 8 || new_password.length > 30){  return res.status(400).json({ message: 'Пароль не может быть больше 30 и меньше 8 символов', message_en: "The password can not be more than 30 and less than 8 characters"}) }
        let user = await User.findOne({ where: { id: req.user.id } });
        if(!user.isValidPassword(password)){ return  res.status(400).json({ message: 'Пароль неверный', message_en: 'Invalid password'})}
        user.password = new_password;
        await user.save();
        let token = jwt.getToken(user.toJSON());
        return res.json({ token });
    } catch (error) { return errorHelper.hear(res, error); } 
});

// Смена почты ( Не работает (Пока что) )
_route.post('/change/email', async (req, res) => {
   try {
       
   } catch (error) { return errorHelper.hear(res, error)} 
});

// Смена скина! Content-Type: multipart/form-data 
_route.post('/change/skin', multer({ 
    dest: path.resolve('..', 'skins'),
    storage: multer.diskStorage({
        filename: (req, file, callback) => {
            if(file.mimetype == 'image/png'){
                return callback(null, `${req.user.email}.png`);
            }
            return callback(new Error(`Только .png скины!`), null);
        }
    }),
    limits: { fileSize: 1024 * 1024 }
}).single('skin'), async (req, res) => {
    try {
        if(!req.file){ return res.status(400).json({ message: "Файл скина не указан", message_en: "The skin file is not specified"}); }
        
        return res.json({ message: "Скин установлен", message_en: "Skin installed"})
    } catch (error) { return errorHelper.hear(res, error)} 
 });

module.exports = _route;