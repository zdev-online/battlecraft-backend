const _route        = require('express').Router();
const path          = require('path');
const multer        = require('multer');
const axios         = require('axios').default;
const errorHelper   = require('../utils/errorHear');
const tfa           = require('../utils/2fa');
const jwt           = require('../utils/jwt');
const User          = require('../database/models/User');
const Temp2fa       = require('../database/models/Temp2fa');
const Players       = require('../database/models/Players');
const Skins         = require('../database/models/Skins');
const FormData      = require('form-data');
const fs            = require('fs');

// Запрос на добавление \ сброс 2-х факторной аунтентификации
_route.get('/2fa', async (req, res) => {
    try {
        // Если не указан тип 2fa-авторизации - ошибка
        if(!req.query.type){ return res.status(400).json({ message: "Не указан тип 2FA", message_en: "2FA type not specified"}); }
        
        // Деструктуризируем объект данных
        let { type }    = req.query;
        // Получаем пользователя
        let user        = await User.findOne({where: { email: req.user.email }});
        // Проверяем тип и в зависимость от типа - выполняем то или иное действие
        switch (type) {
            // Google Auth
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
                // Сохранение пользователя
                await user.save();
                user = user.toJSON();
                // Генерация токена
                let token       = jwt.getToken(user);
                // Удаление секретных данных
                delete user.tfaSecret;
                delete user.emailCode;
                delete user.password;
                // Отдаем клиенту
                return res.json({ token, user });
            }
            default: return res.status(404).json({ message: "Неизвеcтный 2FA тип", message_en: "Unknown 2FA type" });                      
        }
    } catch (error) { return errorHelper.hear(res, error) }
});

// Подтверждения запроса на 2-х факторную аунтентификацию
_route.post('/2fa/confirm', async (req, res) => {
    try {
        // Проверка на то - все ли данные пришли
        if(!req.body.code){ return res.status(400).json({ message: 'Неверный код подтверждения', message_en: "Invalid confirm code"}); }
        // Проверяем есть ли в ожидающих подтверждения 2fa-авторизации акканут пользователя
        let temp2fa = await Temp2fa.findOne({ where: { userId: req.user.id }});
        // Если нет - ошибка
        if(!temp2fa){ return res.status(404).json({ message: "Запроса на 2FA активацию не было", message_en: "No request to activate 2-factor authorization"});}
        // Если тип 2fa - google auth
        if(temp2fa.tfaType == 'google'){
            // Проверяем текущий код с введеным, если не верен - ошибка
            if(!tfa.checkCode(req.body.code, temp2fa.tfaCode)){ return res.status(400).json({ message: 'Неверный код подтверждения', message_en: "Invalid confirm code"}); }
            // Находим пользователя    
            let user = await User.findOne({ where: { id: req.user.id }});
            // Записываем пользователю google 2fa-тип и секретный код
            user.tfaType    = temp2fa.tfaType;
            user.tfaSecret  = temp2fa.tfaCode;
            // Сохраняем пользователя
            await user.save();
            // Удаляем из ожидающих подтверждения
            await Temp2fa.destroy({ where: { userId: req.user.id }});
            // Получаем чистый JSON-Объект пользователя
            user = user.toJSON();
            // Генерируем токен
            let token = jwt.getToken(user);
            // Удаляем секретные данные пользователя
            delete user.tfaSecret;
            delete user.emailCode;
            delete user.password;
            // Отдаем клиенту
            return res.json({ token, user });
        }
    } catch (error) { return errorHelper.hear(res, error) }
});

// Смена пароля
_route.post('/change/password', async (req, res) => {
    try {
        // Проверка на то - все ли данные пришли
        if(!req.body.password){ return res.status(400).json({ message: 'Не указан текущий пароль', message_en: 'The current password is not specified'}); }
        if(!req.body.new_password){ return res.status(400).json({ message: 'Не указан новый пароль', message_en: 'The new-password is not specified'}); }
        if(!req.body.new_password_accept){ return res.status(400).json({ message: 'Не указан подтверждающий пароль', message_en: 'Confirmation password not specified'}); }
        
        // Деструктуризация объекта данных
        let { password, new_password, new_password_accept } = req.body;
        // Если новый пароль не совпадает с новым паролем-подтверждение - ошибка
        if(new_password != new_password_accept){ return res.status(400).json({ message: 'Пароли не совпадают', message_en: "Passwords don't match"})}
        // Если длина нового пароля меньше 8 или больше 30 символов - ошибка
        if(new_password.length < 8 || new_password.length > 30){  return res.status(400).json({ message: 'Пароль не может быть больше 30 и меньше 8 символов', message_en: "The password can not be more than 30 and less than 8 characters"}) }
        // Находим пользователя
        let user = await User.findOne({ where: { id: req.user.id } });
        // Проверяем верен ли старый пароль    
        if(!user.isValidPassword(password)){ return  res.status(400).json({ message: 'Пароль неверный', message_en: 'Invalid password'})}
        // Записываем новый пароль
        user.password = new_password;
        // Сохраняем пользователя
        await user.save();
        // Генерируем и отдаем новый токен
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
    storage: multer.diskStorage({
        destination: path.resolve('skins'),
        filename: (req, file, callback) => {
            if(file.mimetype == 'image/png'){
                return callback(false, `${req.user.email}.png`);
            }
            return callback(new Error(`Только .png скины!`));
        }
    }),
    limits: { fileSize: 1024 * 1024 }
}).single('skin'), async (req, res) => {
    try {
        if(!req.file){ return res.status(400).json({ message: "Файл скина не указан", message_en: "The skin file is not specified"}); }
        // Создаем форму с изображением
        let form        = new FormData();
        form.append('file', fs.createReadStream(path.resolve('skins', `${req.user.email}.png`)));
        // Отправляем скин на генерацию
        let data        = await axios.post("https://api.mineskin.org/generate/upload", form, {headers: form.getHeaders()});
        if(data.data.data){
            let { texture } = data.data.data;
            if(!texture || !texture.value || !texture.signature){ return res.status(500).json({ message: "Не удалось загрузить скин!", message_en: "Failed to load skin" }); }
            let { value, signature } = texture;
            let timestamp = "9223243187835955807";
            // Ищем в скинах - скин по логину (ник) пользователя
            let skin = await Skins.findOne({ where: { Nick: req.user.login }});
            // Если нету генерируем
            if(!skin){  skin = Skins.build({ Nick: req.user.login }); }
            // Подставляем нужные значения
            skin.Value      = value;
            skin.Signature  = signature;
            skin.timestamp  = timestamp;
            // Сохраняем скин
            await skin.save();
            // Ищем в таблице игроков - игрока по логину (ник) пользователя
            let player = await Players.findOne({ where: { Nick: req.user.login } });
            // Если нету - генерируем
            if(!player){ player = Players.build({ Nick: req.user.login }); }
            // Подставляем значения
            player.Skin = ` ${req.user.login}`;
            // Сохраняем
            await player.save();
            // Ищем пользователя в таблице пользователей
            let user = await User.findOne({ where: { email: req.user.email } });
            // Обновляем имя файла скин
            user.skin = req.file.filename;
            // Сохраняем
            await user.save();
            // Отправляем ответ
            return res.json({ skin: user.skin });
        } else {
            return res.status(500).json({ message: "Не удалось загрузить скин!", message_en: "Failed to load skin" });
        }
    } catch (error) { return errorHelper.hear(res, error)} 
 });

setInterval(async () => {
    try {
        await Temp2fa.destroy({ where: { expires: { $lte: new Date().getTime() } } });
    } catch (error) { return console.error(`Ошибка удаления истекших 2fa-кодов подтверждения: ${error.message}\n${error.stack}`); }
}, 1000 * 60 * 5);

module.exports = _route;