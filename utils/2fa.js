const speakeasy = require('speakeasy');
const qrcode    = require('qrcode');
const config    = require('../config.json');

module.exports.generateQrCode = async () => {
    let secretCode  = speakeasy.generateSecret(config.googleAuth);
    let imageCode   = await qrcode.toDataURL(secretCode.otpauth_url);
    return { secret: secretCode.base32, imageCode }
}

module.exports.checkCode = (code, secretCodeBase32) => {
    return speakeasy.totp.verify({
        secret: secretCodeBase32,
        token: code,
        encoding: "base32"
    });
}