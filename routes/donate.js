const _route            = require('express').Router();
const ifAuthed          = require('../middlewares/ifAuthed');
const errorHear         = require('../utils/errorHear');
const UnitPay           = require('../modules/UnitPay');       

const upay              = new UnitPay();

_route.get('/unitpay', ifAuthed, async (req, res) => {
    try {
        let { email } = req.user;
        let data = await upay.getPayData(email, req.query.desc, req.query.sum, req.query.payType, req.ip);
        return res.json(data);
    } catch(error) { return errorHear.hear(res, error); }
});

_route.get('/unitpay/callback', upay.handler);


module.exports = _route;