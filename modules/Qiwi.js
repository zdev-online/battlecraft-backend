const sha256        = require('sha256'); 
const QiwiApi       = require('@qiwi/bill-payments-node-js-sdk');
const QiwiModel     = require('../database/models/Qiwi');
const User          = require('../database/models/User');
const { qiwi:cfg }  = require('../config.json');
const ipsCheck      = require('ip-range-check');
const qiwi          = new QiwiApi(cfg.secret_key);

class Qiwi {
    constructor(){
        this.ips = [
            "79.142.16.0/20",
            "195.189.100.0/22",
            "91.232.230.0/23",
            "91.213.51.0/24"
        ];
    }
    async getPaymentLink(email, amount){
        let billId  = qiwi.generateId();
        let data    = await qiwi.createBill(billId, { 
            amount,
            currency: 'RUB',
            comment: cfg.comment,
            expirationDateTime: new Date()
        })        
        let userData    = await QiwiModel.create({ billId, email, amount });
        data.model      = userData;
        return data;
    }
    async handler(req, res, next){
        try {
            if(!ipsCheck(req.ip, this.ips)){ return next(); }
            let qiwi_sign   = req.headers["X-Api-Signature-SHA256"];
            let { billId, status }  = req.body;
            if(qiwi.checkNotificationSignature(qiwi_sign, req.body, cfg.secret_key)){
                let qiwiData = await QiwiModel.findOne({ where: { billId } });
                if(!qiwiData){ return res.json({ message: "USER_NOT_FOUND" }); }
                if(status.value == 'WAITING'){ return res.json(); }
                if(status.value == 'PAID'){ 
                    let user = await User.findOne({ where: { email: qiwiData.email } });
                    user.crystals += qiwiData.amount;
                    await user.save();
                    res.json();
                    return qiwiData.destroy().catch((error) => {
                        console.log(`Не удалось удалить счет из таблицы 'qiwi' ID: ${qiwiData.id}. ${error.message}`);
                    });
                }
                if(status.value == 'EXPIRED' || status.value == 'REJECTED'){
                    await qiwiData.destroy().catch((error) => {
                        console.log(`Не удалось удалить счет из таблицы 'qiwi' ID: ${qiwiData.id}. ${error.message}`);
                    });
                    return res.json();
                }
            }
        } catch(error){ return res.status(500).json({ error: 'Ошибка на стороне сервера мерчанта' });}
    }
}

module.exports = Qiwi;