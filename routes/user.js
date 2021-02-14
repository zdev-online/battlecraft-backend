const _route        = require('express').Router();
const errorHelper   = require('../utils/errorHear');
const tfa           = require('../utils/2fa');
const jwt           = require('../utils/jwt');
const User          = require('../database/models/User');

_route.get('/2fa', async (req, res) => {
    try {
        if(!req.query.type){ return res.status(400).json({ message: "Не указан тип 2FA", message_en: "2FA type not specified"}); }
        
        let { type }    = req.query;
        let user        = await User.findOne({ email: req.user.email });
        switch (type) {
            case 'google': { 
                let data    = await tfa.generateQrCode();
                // Временное хранилище подтверждения 2fa
                return res.json({ qrcode: data.imageCode });
            }
            case 'email': {
                let code    = Math.round(Math.random() * 1000000);
                // Временное хранилище подтверждения 2fa
                return res.json({ email: req.user.email });
            }   
            case 'none': {
                user.tfaType    = 'none';
                user.tfaSecret  = '';
                user.emailCode  = 0;
                user.save();
                let token       = jwt.getToken(user);
                delete user.tfaSecret;
                delete user.emailCode;
                delete user.password;
                return res.json({ token, user: user.toJSON() });
            }
            default: return res.status(404).json({ message: "Неизветный 2FA тип", message_en: "Unknown 2FA type" });                      
        }
    } catch (error) { return errorHelper.hear(res, error) }
});

_route.post('/2fa/confirm', async (req, res) => {
    try {
        
    } catch (error) { return errorHelper.hear(res, error) }
});

module.exports = _route;