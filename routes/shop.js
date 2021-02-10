const _route = require('express').Router();

_route.get('/', (req, res) => {});

_route.get('/product/:id', (req, res) => {
    try {
        if(!req.params.id){ return res.status(404).json({ message: 'Product with this id not found' }); }
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = _route;