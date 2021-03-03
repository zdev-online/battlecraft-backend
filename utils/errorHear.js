module.exports.hear = (res, error) => {
    switch(error.name){
        case "TokenExpiredError": {
            return res.status(400).json({ message: "Срок действия токена истек!", message_en: "Token expired" });
        }
        case "JsonWebTokenError": {
            return res.status(400).json({ message: "Неверный токен", message_en: "Invalid token" });
        }
        case "NotBeforeError": {
            return res.status(400).json({ message: "Токен не активен", message_en: "Token not active" });
        }
    }
    console.log(`Ошибка: ${error.message}\n${error.stack || ''}`);
    return res.status(500).json({ message: "Ошибка сервера", message_en: "Server error" });
}