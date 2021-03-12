const _route        = require('express').Router();
const errorHear     = require('../utils/errorHear');
const paginate      = require('../utils/paginate');
const srvUtil       = require('../utils/servers');
const Products      = require('../database/models/Products');
const Permissions   = require('../database/models/Permissions');
const User          = require('../database/models/User');    
const Donate        = require('../database/models/Donate');
const ifAuthed      = require('../middlewares/ifAuthed');
const servers       = require('../servers.json');

// Получить страницу товаров 
_route.get('/', async (req, res) => { 
    try {
        // req.query.server - id сервера из servers.json, а именно model_name
        // Получить список доступных серверов: GET -> localhost:4000/servers
        let server = req.query.server ? { server: req.query.server} : {}; 
        // data:
        //  current_page - текущая страница
        //  page_count - кол-во страниц
        //  data - данные товара
        let data = await paginate(Products, req.query.page || 1, server); 
        return res.json(data);
    } catch (error) { return errorHear.hear(res, error) }
});
_route.post('/:id/buy', ifAuthed, async (req, res) => {
    try {
        let { server:srvId, id:productId, count } = req.body;
        let product = await Products.findOne({ id: productId });
        // Если товара - нет
        if(!product){ return res.status(404).json({ message: "Товар не найден", message_en: "Product not found" }); }
        // Если цена товара больше, чем кристаллов у пользователя
        if(product.price > req.user.crystals){ return res.status(403).json({ message: "Не хватает кристаллов", message: "Not enough crystals" }); }
        switch(product.type){
            // Вещь
            case 'item': {
                // Указано ли кол-во предметов
                if(Number.isInteger(Number(count))){ return res.status(400).json({ message: "Укажите количество", message_en: "Specify the quantity" }); }
                // Получаем данные сервера
                let server = srvUtil.getData(srvId);
                // Если нету сервера, то отправляем ошибку
                if(!server){ return res.status(404).json({ message: "Сервер не найден", message_en: "Server not found" }); }
                // Формируем команду для RCON
                let command = product.command;
                command = command.replace('%NICK%', req.user.login)
                command = command.replace('%COUNT%', count);
                // Отправляем
                await srvUtil.sendCommand(server, command);
                // Нахордим пользователя
                let user = await User.findOne();
                // Вычитаем кристаллы,  сохраняем и отправляем ответ
                user.crystals -= product.price;
                await user.save();
                return res.json({ product });
            }
            // Привелегия
            case 'privilege': {
                let db = Permissions[srvId];
                // Если нету цены, то отправляем ошибку
                if(Number.isInteger(Number(count))){ return res.status(400).json({ message: "Укажите количество", message_en: "Specify the quantity" }); }
                // Если нету модели сервера, то отправляем ошибку
                if(!db){ return res.status(404).json({ message: "Сервер не найден", message_en: "Server not found" }); }
                // Если нету привилегии, то отправляем ошибку
                if(!req.body.privilege || !srvUtil.isValidPrivilege(req.body.privilege)){ return res.status(400).json({ message: "Неверный тип привилегии", message_en: "Invalid privilege type" })}
                // Узнаем тип системы привилегий у сервера
                switch(db.type){
                    case 'pex': {
                        
                    }
                    case 'luckyperms': {

                    }
                    default: { return res.status(404).json({ message: "Неизвестный тип сервера", message_en: "Unknown server type" }); }
                }
            }
            default: { return res.status(500).json({ message_en: 'Server error', message: 'Ошибка на стороне сервера'}); }
        }
    } catch (error) { return errorHear.hear(res, error); }
});

module.exports = _route;