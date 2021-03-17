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
        let server  = req.query.server ? { server: req.query.server} : {}; 
        // Категории товаров:
        //  item - предмет
        //  privilege - привелегия
        let type    = req.query.type ? { type: req.query.type } : {};
        // data:
        //  current_page - текущая страница
        //  page_count - кол-во страниц
        //  data - данные товара
        let data = await paginate(Products, req.query.page || 1, { ...server, ...type }); 
        return res.json(data);
    } catch (error) { return errorHear.hear(res, error) }
});
_route.post('/buy', ifAuthed, async (req, res) => {
    try {
        // ID - Товаров
        let { products: productsIds } = req.body;
        let products = await Products.findAll({ where: { id: { $in: productsIds }}});
        // Если товаров - нет
        if(!products.length){ return res.status(404).json({ message: "Товары не найдены", message_en: "Products not found" }); }
        // Если цена товара больше, чем кристаллов у пользователя
        let allPrice    = products.reduce((prev, current) => (prev.price + current.price));
        if(allPrice > req.user.crystals){ return res.status(403).json({ message: "Не хватает кристаллов", message: "Not enough crystals" }); }
        // Перебираем товары
        for(let i = 0; i < products.length; i++){
            let { type, server, data }  = products[i];
            let server_data             = srvUtil.getData(server);
            if(type == 'item'){
                // Форматируем команду
                let command = data.replace(/\%nick\%/i, req.user.login);
                // Отправляем на сервер и ждем ответа
                await srvUtil.sendCommand(server_data, command);
            }
            if(type == 'privilege'){
                // Получаем (модель) по ID
                // Сравниваем по типу
                let db = Permissions[server];
                if(server_data.type == 'pex'){
                    // Находим
                    let privilege = await db.db.findOne({ where: { child: req.user.login } });
                    // Если нет - создаем
                    if(!privilege){
                        privilege = db.db.build({ child: req.user.login, parent:data });
                    }
                    // Обновляем
                    privilege.parent = data;
                    await privilege.save();
                }
                if(server_data.type == 'luckyperms'){
                    // Находим
                    let privilege = await db.db.findOne({ where: { uuid: req.user.login } });
                    // Если нет - создаем
                    if(!privilege){
                        privilege = db.db.build({ uuid: req.user.login, permission: data });
                    }
                    // Обновляем
                    privilege.permission = data;
                    await privilege.save();
                }
            }
        }
        // Вычитаем из криссталов пользователя сумму на которую он закупился
        let user = await User.findOne({ where: { email: req.user.email } });
        user.crystals -= allPrice;
        await user.save();
        return res.json({ products: productsIds }); 
    } catch (error) { return errorHear.hear(res, error); }
});

setInterval(async () => {
    try {
        // Находим всех донатеров, где срок конца меньше, чем текущая дата
        let donate = await Donate.findAll({ 
            where: { 
                expires: {
                    $lte: new Date().getTime() 
                }
            }
        });
        // Перебираем просроченных-донатеров :)
        for (let i = 0; i < donate.length; i++) {
            // Получаем объект модели и типа таблицы
            // let db = Permissions[donate[i].server];
            // // Если нет, кидаем ошибку, т.к исключений не должно быть
            // if(!db){ throw `Сервер не найден в servers.json, но найден в donate.sql`; }
            // // Деструктурируем объект модели
            // let { db: model, type } = db;
            // // В зависимости от типа таблицы, выполняем то или иное действие
            // switch(type){
            //     case 'pex': {
            //         await model.destroy({ where: { child: req.user.login } });
            //         break;
            //     }
            //     case 'luckyperms': {
            //         await model.destroy({ where: { uuid: req.user.login } });
            //         break;
            //     }
            //     default: { throw `Тип не найден в servers.json, но найден в Donate.js`; }
            // }
            // В конце удаляем из просроченных-донатеров пользователя
            await donate[i].destroy();
        }
    } catch (error) { console.error(`Ошибка проверки просроченности доната: ${error.message}\n${error.stack}`); }
}, 1000 * 60 * 60 * 12);

module.exports = _route;