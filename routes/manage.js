const _route = require('express').Router();

_route.get('/news', async (req, res) => {});
_route.post('/news', async (req, res) => {});
_route.delete('/news/:id', async (req, res) => {});

_route.get('/streams', async (req, res) => {});
_route.post('/streams', async (req, res) => {});
_route.delete('/streams/:id', async (req, res) => {});

module.exports = _route;