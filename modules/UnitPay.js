const sha256    = require('sha256'); 
const axios     = require('axios').default;
const Unitpay   = require('../database/models/Unitpay');
const User      = require('../database/models/User');
const Refs      = require('../database/models/Referals');
const config    = require('../config.json');

module.exports  = class UnitPay {
    constructor(){
        this.ips            = ["31.186.100.49", "178.132.203.105", "52.29.152.23", "52.19.56.234"];
        this.createError    = (message) => ({ error: { message } });
        this.createResponse = (message) => ({ result: { message } });
        this.url            = "https://unitpay.ru/api";
    }

    getSign(email, currency, desc, sum, secretKey){
        let sign = sha256(`${email}{up}${currency}{up}${desc}{up}${sum}{up}${secretKey}`);
        return sign;
    }

    async getPayData(email, desc, sum, payType, ip){
        let sign        = this.getSign(email, 'RUB', desc, sum, config.unitpay.secretKey);
        let { data }    = await axios.get(this.url, { 
            params: {
                paymentType: payType,
                account: email,
                desc, sum, ip, 
                projectId: config.unitpay.projectId,
                signature: sign
            }
        });
        await Unitpay.create({ sum, email, sign, payId: data.paymentId });
        return data;
    }

    async handler(req, res, next){
        try {
            if(!this.ips.includes(req.ip)){ return res.json(this.createError("Ты не из UnitPay ^_^")); }
            let { method, orderSum, orderCurrency, account:email, signature:sign, projectId, unitpayId } = req.query;
            if(projectId != config.unitpay.projectId){ return res.json(this.createError("Валидация заказа провалена!")); }
            if(orderCurrency != 'RUB'){ return res.json(this.createError("Валидация заказа провалена!")); }
            let payment = await Unitpay.findOne({ where: { email, sign }});
            if(!payment){ return res.json(this.createError('Валидация заказа провалена!')); } 
            if(orderSum != payment.sum){ return res.json(this.createError('Валидация заказа провалена!')); }
            if(unitpayId != payment.payId){ return res.json(this.createError('Валидация заказа провалена!')); }
            switch(String(method).toUpperCase()){
                case 'CHECK': { return res.json(this.createResponse('Заказ обработан!')) }
                case 'PAY': { 
                    let user = await User.findOne({ where: { email }});
                    if(!user){ return res.json(this.createError("Валидация заказа провалена!"))}
                    user.crystals += orderSum;
                    let ref = await Refs.findOne({ where: { user_id: user.id } });
                    if(ref){
                        let ref_owner = await User.findOne({ where: { id: ref.owner_id } });
                        ref_owner.crystals += Math.floor((orderSum / 100) * 10);
                        await ref_owner.save();
                    }
                    await user.save();
                    return res.json(this.createResponse("Кристаллы выданы!"));
                }
                case 'ERROR': {
                    console.error(`Unitpay ERROR: ${req.query.errorMessage}`);
                    return res.json(this.createError("Ошибка принята!"))
                }
                default: { return res.json(this.createError("Валидация заказа провалена!")); }
            }
        } catch (error) { 
            return res.json({ error: { message: "Ошибка сервера!" } })
        }
    }
}