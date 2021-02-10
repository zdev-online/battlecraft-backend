const _route    = require('express').Router();
const _ifAuthed = require('../middlewares/ifAuthed');
const Products  = require('../database/models/Products');

_route.get('/', (req, res) => {
    return res.json({});
});

_route.get('/product/:id', async (req, res) => {
    try {
        if(!req.params.id){ return res.status(404).json({ message: 'Product with this id not found' }); }
        if(Number.isNaN(Number(req.params.id))){ return res.status(404).json({ message: 'Product with this id not found' }); }
        let product = await Products.findOne({ where: {id: req.params.id} });
        if(!product){ return res.status(404).json({ message: "Product not found"}); }
        return res.json(product.toJSON());
    } catch (error) {
        console.log(`Error in shop/${req.path} -> ${error}`);
        return res.status(500).json({ message: "Server error" });
    }
});

_route.post('/buy/:id', _ifAuthed, async (req, res) => {
    try {
        if(!req.params.id){ return res.status(404).json({ message: 'Product with this id not found' }); }
        if(Number.isNaN(Number(req.params.id))){ return res.status(404).json({ message: 'Product with this id not found' }); }
        let product = await Products.findOne({ where: {id: req.params.id} });
        if(!product){ return res.status(404).json({ message: "Product not found"}); }
        // Продумать логику 

    } catch (error) {
        console.log(`Error in shop/${req.path} -> ${error}`);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = _route;