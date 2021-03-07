const _route    = require('express').Router();
const errorHear = require('../utils/errorHear');
const paginate  = require('../utils/paginate');
const srvUtil   = require('../utils/servers');
const Products  = require('../database/models/Products');
const User      = require('../database/models/User');    
const Donate    = require('../database/models/Donate');
const ifAuthed  = require('../middlewares/ifAuthed');
const servers   = require('../servers.json');

_route.get('/', async (req, res) => { 
    try {
        let data = await paginate(Products, req.query.page || 1, {}); 
        return res.json(data);
    } catch (error) { return errorHear.hear(res, error) }
});
_route.post('/:id/buy', ifAuthed, async (req, res) => {
    try {
        let { id } = req.params;
        let { crystals }  = req.user;
        if(!Number.isInteger(Number(id))){ return res.status(400).json({ message: "Неверный ID товара", message_en: "Invalid product ID" }); }
        let product = await Products.findOne({ where: { id } });
        if(!product){  return res.status(400).json({ message: "Товар не найден", message_en: "Product not found" }); }
        if(product.price > crystals){ return res.status(400).json({ message: "Не хватает кристаллов", message_en: "Not enough crystals" }); }
        if(product.type == 'item'){
            
        } else if(product.type == 'privilege'){

        }
    } catch (error) { return errorHear.hear(res, error); }
});

module.exports = _route;