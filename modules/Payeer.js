const sha256    = require('sha256'); 
const axios     = require('axios').default;
const config    = require('../config.json');

class Payeer {
    async getPaymentLink(email, price){
        let data = {
            ...config.payeer,
            action: "invoiceCreate",
            m_orderid: email,
            m_amount: price,
            m_curr: 'RUB' 
        }
        let link = await axios.post("https://payeer.com/ajax/api/api.php?invoiceCreate", data); 
        
    }
    async handler(req, res){
        
    }
}

module.exports = Payeer;