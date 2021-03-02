const _route    = require('express').Router();
const multer    = require('multer');
const path      = require('path');
const errorHear = require('../utils/errorHear');
const News      = require('../database/models/News');
const User      = require('../database/models/User');
const isManager = require('../middlewares/isManager');

_route.get('/news', async (req, res) => {});
_route.post('/news', multer({
    storage: multer.diskStorage({
        destination: path.resolve('..', 'images'),
        filename: (req, file, callback) => {
            return callback(null, `${file.originalname}`);
        }
    })
}).single('image'), async (req, res) => {
    try {
        let { title, text } = req.body;
        let img_url         = req.file ? req.file.filename : ''; 
        let news            = await News.create({ title, text, img_url });
        return res.json(news.toJSON());
    } catch (error) { return errorHear.hear(res, error); }
});
_route.post('/news/:id/edit', async (req, res) => {
    try {
        if(!req.params.id || !Number.isInteger(Number(req.params.id))){ return res.status(400).json({ message: "Неизвеcтный ID новости", message_en: "Unknown news ID" }); }
        let news = await News.findOne({ id: req.params.id });
        if(!news){ return res.status(400).json({ message: "Новость с данным ID не найдена", message_en: "News with that ID not found" }); }
        news.title      = (req.body.title.length) ? req.body.title : news.title;
        news.text       = (req.body.text.length) ? req.body.text : news.text;
        await news.save();
        return res.json(news.toJSON());
    } catch (error) { return errorHear.hear(res, erorr); }
});
_route.delete('/news/:id', async (req, res) => {
    try {
        if(!req.params.id){ return res.status(400).json({ message: "Неверный ID новости", message_en: "Invalid news id" }); }
        let news = await News.findOne({where: { id: req.params.id }});
        if(!news){ return res.status(400).json({ message: "Неверный ID новости", message_en: "Invalid news id" }); }
        await news.destroy({});
        return res.json({ message: 'Новость удалена', message_en: "News deleted" });
    } catch (error) { return errorHear.hear(res, error); }
});

_route.get('/streams', async (req, res) => {});
_route.post('/streams', async (req, res) => {});
_route.post('/streams/:id/delete', async (req, res) => {
    try {
        if(!req.params.id || !Number.isInteger(Number(req.params.id))){}
    } catch (error) { return errorHear.hear(res, error); }
});

_route.post('/edit/role', async (req, res) => {
    try {
        if(!req.body.email){ return res.status(400).json({ message: "Неверный E-Mail", message_en: "Invalid E-Mail" }); }
        if(!req.body.role){ return res.status(400).json({ message: "Неверная роль", message_en: "Invalid role" }); }
        let { email, role } = req.body;
        if(role != 'user' && role != 'admin' && role != 'moder'){ return res.status(400).json({ message: "Неверная роль", message_en: "Invalid role" }); }
        let user = await User.findOne({ email });
        if(!user){ return res.status(400).json({ message: "Пользователь не найден", message_en: "User not found" }); }
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

module.exports = _route;