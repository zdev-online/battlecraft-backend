const _route            = require('express').Router();
const ifAuthed          = require('../middlewares/ifAuthed');
const errorHear         = require('../utils/errorHear');
const UnitPay           = require('../modules/UnitPay');       
const Qiwi              = require('../modules/Qiwi');

const upay              = new UnitPay();
const qiwi              = new Qiwi();

// Unitpay
_route.get('/unitpay', ifAuthed, async (req, res) => {
    try {
        if(req.query.desc){ return res.status(400).json({ mesasge: "Неверное описание счета", message_en: "" }); } 
        if(req.query.sum){ return res.status(400).json({ mesasge: "Неверная сумма", message_en: "" }); } 
        if(req.query.payType){ return res.status(400).json({ mesasge: "Неверный тип оплаты", message_en: "" }); }
        let { email } = req.user;
        let data = await upay.getPayData(email, req.query.desc, req.query.sum, req.query.payType, req.ip);
        return res.json(data);
    } catch(error) { return errorHear.hear(res, error); }
});

_route.get('/unitpay/callback', upay.handler);

// QIWI
_route.get('/qiwi', ifAuthed, async (req, res) => {
    try {
        if(!req.query.amount){ return res.status(400).json({ mesasge: "Не указана сумма доната", message_en: "Not specifien donate sum" }); }
        let data = qiwi.getPaymentLink(req.amount);
        return res.json({ url: data.payUrl });
    } catch (error) { return errorHear(res, error); }
});

_route.post('/qiwi/callback', qiwi.handler);

module.exports = _route;