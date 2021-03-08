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
_route.post('/:id/buy', ifAuthed, async (req, res) => {});

module.exports = _route;