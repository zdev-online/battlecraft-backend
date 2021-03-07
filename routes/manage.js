const _route    = require('express').Router();
const multer    = require('multer');
const path      = require('path');
const errorHear = require('../utils/errorHear');
const News      = require('../database/models/News');
const User      = require('../database/models/User');
const Streams   = require('../database/models/Streams');
const isManager = require('../middlewares/isManager');
const paginate  = require('../utils/paginate');

// Новости
// Получить новости по страницам
_route.get('/news', async (req, res) => {
    try {
        if(!req.query.page){ return res.status(400).json({ message: "Страница не указана", message: "Page not defined" }); }
        let news = await paginate(News, req.query.page);
        return res.json(news);
    } catch (error) { return errorHear.hear(res, error); }
});
// Добавить новость
_route.post('/news/add', multer({
    storage: multer.diskStorage({
        destination: path.resolve('images'),
        filename: (req, file, callback) => {
            return callback(null, `${file.originalname}`);
        }
    })
}).single('image'), async (req, res) => {
    try {
        if(!req.body.title){ return res.status(400).json({ message: "Не указан заголовок", message_en: "Title not defined" }); }
        if(!req.body.text){ return res.status(400).json({ message: "Не указан текст", message_en: "Text not defined" }); }
        let { title, text } = req.body;
        let img_url         = req.file ? req.file.filename : ''; 
        let news            = await News.create({ title, text, img_url });
        return res.json(news.toJSON());
    } catch (error) { return errorHear.hear(res, error); }
});
// Редактировать новость
_route.post('/news/:id/edit', async (req, res) => {
    try {
        if(!req.params.id || !Number.isInteger(Number(req.params.id))){ return res.status(400).json({ message: "Неизвеcтный ID новости", message_en: "Unknown news ID" }); }
        let news = await News.findOne({ where: { id: req.params.id }});
        if(!news){ return res.status(400).json({ message: "Новость с данным ID не найдена", message_en: "News with that ID not found" }); }
        news.title      = (String(req.body.title).length) ? String(req.body.title) : news.title;
        news.text       = (String(req.body.text).length) ? String(req.body.text) : news.text;
        await news.save();
        return res.json(news.toJSON());
    } catch (error) { return errorHear.hear(res, erorr); }
});
// Удалить новость
_route.post('/news/:id/delete', async (req, res) => {
    try {
        if(!req.params.id){ return res.status(400).json({ message: "Неверный ID новости", message_en: "Invalid news id" }); }
        let news = await News.findOne({where: { id: req.params.id }});
        if(!news){ return res.status(400).json({ message: "Неверный ID новости", message_en: "Invalid news id" }); }
        await news.destroy({});
        return res.json({ message: 'Новость удалена', message_en: "News deleted" });
    } catch (error) { return errorHear.hear(res, error); }
});

// Стримеры 
// Получить стримеров
_route.get('/streams', async (req, res) => {
    try {
        let streams = await Streams.findAll();
        return res.json(streams);
    } catch (error) { return errorHear.hear(res, error); }
});
// Добавить стримера
_route.post('/streams/add', async (req, res) => {
    try {
        if(!req.body.channel){ return res.status(400).json({ message: "Название канала не указано", message_en: "Channel name not defined" }); }
        let { channel } = req.body;
        let isStreamHas = await Streams.findOne({ where: { channel } });
        if(isStreamHas){ return res.status(400).json({ message: "Стример уже добавлен", message_en: "Streamer already added" })}
        let stream = await Streams.create({ channel });
        return res.json(stream.toJSON());
    } catch (error) { return errorHear.hear(res, error); }
});
// Удалить стримера
_route.post('/streams/:id/delete', async (req, res) => {
    try {
        if(!req.params.id || !Number.isInteger(Number(req.params.id))){ return res.status(400).json({ message: "Неизвеcтный ID стрима", message_en: "Unknown stream ID" }); }
        let stream = await Streams.findOne({ where: { id: req.params.id } });
        if(!stream){ return res.status(400).json({ message: "Неизвеcтный ID стрима", message_en: "Unknown stream ID" }); }
        await stream.destroy();
        return res.json({ message: 'Стрим удален', message_en: "Stream deleted" });
    } catch (error) { return errorHear.hear(res, error); }
});

// Пользователи
// Редактировать роль пользователя
_route.post('/role/edit', async (req, res) => {
    try {
        if(!req.body.email){ return res.status(400).json({ message: "Неверный E-Mail", message_en: "Invalid E-Mail" }); }
        if(!req.body.role){ return res.status(400).json({ message: "Неверная роль", message_en: "Invalid role" }); }
        let { email, role } = req.body;
        if(role != 'user' && role != 'admin' && role != 'moder'){ return res.status(400).json({ message: "Неверная роль", message_en: "Invalid role" }); }
        let user = await User.findOne({ where: { email } });
        if(!user){ return res.status(400).json({ message: "Пользователь не найден", message_en: "User not found" }); }
        if(user.role >= req.user.role){ return res.status(403).json({ message: "Недостаточно прав", message_en: "Not enough rights" });}
        user.role = role;
        await user.save();
        let roleText = (role == 'user') ? 'пользователя' : (role == 'moder') ? 'модератора' : 'администратора';
        return res.json({ 
            login: user.login, 
            email: user.email, 
            message: `Роль ${user.login} изменена на ${roleText}`,
            message_en: `${user.login} role change to ${role}`
        });
    } catch (error) { return errorHear.hear(res, error); }
});

// Магазин
// Получить товары
_route.post('/shop', async (req, res) => {});
// Добавить товар
_route.post('/shop/add', async (req, res) => {});
// Редактировать товар
_route.post('/shop/:id/edit', async (req, res) => {});
// Удалить товар
_route.post('/shop/:id/delete', async (req, res) => {});

module.exports = _route;