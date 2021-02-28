const _route        = require('express').Router();
const Streams       = require('../database/models/Streams');
const errorHelper   = require('../utils/errorHear');

_route.get('/streams', async (req, res) => {
    try {
        let streams = await Streams.findAll({});
        return res.json(streams);
    } catch (error) { return errorHelper.hear(res, error); }
});

module.exports = _route;