const sha256    = require('sha256'); 
const axios     = require('axios').default;
const config    = require('../config.json');

class Payeer {
    async getPaymentLink(){}
    handlers(){
        return {
            async success(req, res){},
            async fail(req, res){},
            async proccess(req, res){}
        }
    }
}

module.exports = Payeer;