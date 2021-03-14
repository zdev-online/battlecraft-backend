const _route        = require('express').Router();
const errorHelper   = require('../utils/errorHear');
const paginate      = require('../utils/paginate');
const News          = require('../database/models/News');

_route.get('/', async (req, res) => {
    try {
        let news = await paginate(News, req.query.page || 1);
        return res.json(news);
    } catch (error) { return errorHelper.hear(res, error); } 
});

_route.get('/:id', async (req, res) => {
    try {
        if(!Number.isInteger(Number(req.params.id))){ return res.status(400).json({ message: 'Неверный ID', message_en: "Invalid ID"}); }
        let news = await News.findOne({ where: { id: req.params.id }});
        return res.json(news ? news : false);
    } catch (error) { return errorHelper.hear(res, error); }
});

module.exports      = _route;
