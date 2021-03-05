const _route    = require('express').Router();
const errorHear = require('../utils/errorHear');
const paginate  = require('../utils/paginate');
const Shop      = require('../database/models/Shop');

_route.get('/shop', async (req, res) => { 
    try {
        let data = await paginate(Shop, req.query.page || 1, {}); 
        return res.json(data);
    } catch (error) { return errorHear.hear(res, error) }
});
_route.post('/shop/:id/buy', async (req, res) => {
    try {
    } catch (error) { return errorHear.hear(res, error); }
});

module.exports = _route;