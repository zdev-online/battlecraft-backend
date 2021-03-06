const _route    = require('express').Router();
const errorHear = require('../utils/errorHear');
const paginate  = require('../utils/paginate');
const Products  = require('../database/models/Products');
const User      = require('../database/models/User');    
const Rcon      = require('modern-rcon');

_route.get('/', async (req, res) => { 
    try {
        let data = await paginate(Products, req.query.page || 1, {}); 
        return res.json(data);
    } catch (error) { return errorHear.hear(res, error) }
});
_route.post('/:id/buy', async (req, res) => {
    try {
    } catch (error) { return errorHear.hear(res, error); }
});

module.exports = _route;