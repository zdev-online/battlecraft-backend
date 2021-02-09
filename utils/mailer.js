const config    = require('../config.json');
const mailer    = require('nodemailer');

const transport = mailer.createTransport(config.mailer);

module.exports.send = async (to, title, text, html) => {
    let info = await transport.sendMail({
        to, subject: title, text, html, 
        from: `"BattleCraft" <${config.mailer.from}>`  
    });
    return info;
}