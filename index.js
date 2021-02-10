const express   = require('express');
const http      = require('http');
const bodyParse = require('body-parser');
const cors      = require('cors');
const helmet    = require('helmet');
const moment    = require('moment');
const config    = require('./config.json');

const app       = express();
const server    = http.createServer(app);

// Routes
const AuthRoute     = require('./routes/authorization');
const NewsRoute     = require('./routes/news');
const UserRoute     = require('./routes/user');

// Middlewares
const parseToken    = require('./middlewares/parseToken');
const ifNotAuthed   = require('./middlewares/ifNotAuthed');
const ifAuthed      = require('./middlewares/ifAuthed');

// Settings
moment.locale('ru');

// Use middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParse.urlencoded({extended: true}));
app.use(bodyParse.json());
app.use(parseToken);

// Use Routes
app.all('/', (req, res) => res.json({ date: moment() }));
app.use('/auth', AuthRoute);
app.use('/news', NewsRoute);
app.use('/user', ifAuthed, UserRoute);
app.use((req, res) => res.status(404).json({ message: 'Method not found'}));

// API - Server start
server.listen(config.server.port, () => {
    console.log(`API - Server > listen > ::${config.server.port}`);
});