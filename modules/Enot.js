const md5       = require('md5');
const config    = require('../config.json');
const EnotIO    = require('../database/models/Enotio');
const User      = require('../database/models/User');
const Refs      = require('../database/models/Referals');

module.exports  = class EnotIo {
    getSign(order_amount, payment_id){
        let merchant_id     = config.enotio.merchantId;
        let secret_word     = config.enotio.secretWord;
        let sign = `${merchant_id}:${order_amount}:${secret_word}:${payment_id}`;
        return md5(sign);
    }

    async getURL(email, sum){
        let payment = await EnotIO.create({ email, sum });
        let params  = new URLSearchParams();
        params.append('m', config.enotio.merchantId);
        params.append('oa', sum);
        params.append('o', payment.id);
        params.append('s', this.getSign(sum, payment.id));
        let pay_url = `https://enot.io/pay?${params.toString()}`;
        return pay_url;
    }

    async handler(req, res, next){
        try {
            let { merchant, amount:sum, merchant_id:id, sign_2 } = req.body;
            if(merchant != config.merchantId){ return res.status(400).write('Проверка заказа не пройдена'); }
            let sign = md5(`${merchant}:${amount}:${config.enotio.secretWord2}:${merchant_id}`);
            if(sign != sign_2){ return res.status(400).wtire('Проверка заказа не пройдена'); }
            let payment = await EnotIO.findOne({ where: { sum, id }});
            if(!payment){ return res.status(404).write('Заказ не найден'); }
            let user = await User.findOne({ where: { email: payment.email }});
            user.crystals += amount;
            let ref = await Refs.findOne({ where: { user_id: user.id } });
            if(ref){
                let ref_owner = await User.findOne({ where: { id: ref.owner_id } });
                ref_owner.crystals += Math.floor((amount / 100) * 10);
                await ref_owner.save();
            }
            await user.save();
            return res.write('Good'); 
        } catch (error) {
            return res.status(500).write('Server error');
        }
    }
}