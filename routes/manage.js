const _route = require('express').Router();

_route.get('/news', async (req, res) => {});
_route.post('/news', async (req, res) => {});
_route.delete('/news/:id', async (req, res) => {});

_route.get('/streamers', async (req, res) => {});
_route.post('/streamers', async (req, res) => {});
_route.delete('/streamers/:id', async (req, res) => {});

module.exports = _route;