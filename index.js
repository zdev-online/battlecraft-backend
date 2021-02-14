const express   = require('express');
const http      = require('http');
const bodyParse = require('body-parser');
const cors      = require('cors');
const helmet    = require('helmet');
const moment    = require('moment');
const config    = require('./config.json');

const app       = express();
const server    = http.createServer(app);

// Models
const User      = require('./database/models/User');
const News      = require('./database/models/News');
const Products  = require('./database/models/Products');
const Server    = require('./database/models/Server');
const Temp2fa   = require('./database/models/Temp2fa');

// Routes
const AuthRoute     = require('./routes/authorization');
const NewsRoute     = require('./routes/news');
const UserRoute     = require('./routes/user');
const ShopRoute     = require('./routes/shop');

// Middlewares
const parseToken    = require('./middlewares/parseToken');
const ifNotAuthed   = require('./middlewares/ifNotAuthed');
const ifAuthed      = require('./middlewares/ifAuthed');
const logger        = require('./middlewares/logger');

// Settings
moment.locale('ru');

// Use middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParse.urlencoded({extended: true}));
app.use(bodyParse.json());
app.use(parseToken);
app.use(logger);

// Use Routes
app.all('/', (req, res) => res.json({ date: moment().format("HH:mm:ss, DD.MM.YYYY a"), desc: "Возникли проблемы? Обратитесь к разработчику API", developer: "https://vk.com/id171745503" }));
app.use('/auth', AuthRoute);
app.use('/news', NewsRoute);
app.use('/user', ifAuthed, UserRoute);
app.use('/shop', ShopRoute);
app.use((req, res) => res.status(404).json({ message: 'Route not found'}));

// API - Server start
server.listen(config.server.port, async () => {
    console.log(`API - Server > listen > ::${config.server.port}`);
    try {
        await User.sync();
        await News.sync();
        await Products.sync();
        await Server.sync();
        await Temp2fa.sync();
    } catch (error) {
        console.log(`[Model Sync] -> Error -> ${error.message}\n${error.stack}`);
    }
});