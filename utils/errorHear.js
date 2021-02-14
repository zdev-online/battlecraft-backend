module.exports.hear = (res, error) => {
    if(!error.name){ return false; }
    switch(error.name){
        case "TokenExpiredError": {
            res.status(400).json({ message: "Срок действия токена истек!", message_en: "Token expired" });
            return true;
        }
        case "JsonWebTokenError": {
            res.status(500).json({ message: "Ошибка сервера", message_en: "Server error" });
            return true;
        }
        case "NotBeforeError": {
            res.status(400).json({ message: "Токен не активен", message_en: "Token not active" });
            return true;
        }
        default: {
            res.status(500).json({ message: "Ошибка сервера", message_en: "Server error" });
        }
    }
}