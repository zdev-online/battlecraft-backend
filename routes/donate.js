const _route            = require('express').Router();
const ifAuthed          = require('../middlewares/ifAuthed');
const errorHear         = require('../utils/errorHear');
const UnitPay           = require('../modules/UnitPay');       
const EnotIo            = require('../modules/Enot');

const upay              = new UnitPay();
const enot              = new EnotIo();

_route.get('/unitpay', ifAuthed, async (req, res) => {
    try {
        let { email } = req.user;
        let data = await upay.getPayData(email, req.query.desc, req.query.sum, req.query.payType, req.ip);
        return res.json(data);
    } catch(error) { return errorHear.hear(res, error); }
});

_route.get('/enot', ifAuthed, async (req, res) => {
    try {
        let link = await enot.getURL(req.user.email, req.query.sum);
        return res.json({ link });
    } catch (error) { return errorHear.hear(res, error); }
});

_route.get('/unitpay/callback', upay.handler);

_route.post('/enot/callback', enot.handler);

module.exports = _route;