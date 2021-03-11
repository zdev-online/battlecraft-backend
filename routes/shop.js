const _route    = require('express').Router();
const errorHear = require('../utils/errorHear');
const paginate  = require('../utils/paginate');
const srvUtil   = require('../utils/servers');
const Products  = require('../database/models/Products');
const User      = require('../database/models/User');    
const Donate    = require('../database/models/Donate');
const ifAuthed  = require('../middlewares/ifAuthed');
const servers   = require('../servers.json');

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
_route.post('/:id/buy', ifAuthed, async (req, res) => {});

module.exports = _route;