const { Server }    = require('socket.io');
const servers       = require('../utils/servers');

const io            = new Server();
const serversInfo   = [];

io.on('connection', (socket) => {

    // Обновление информации о серверах!
    socket.on('get_servers_info', socket.emit('get_servers_info', serversInfo));

    socket.on('disconnect', (reason) => {
        console.log(`Socket-Client disconnect: ${reason}`);
    });
});

setInterval(async () => {
    try {
        serversInfo = await servers.getServers();
    } catch (error) {
        console.log(`Не удалось получить информацию о серверах: ${error.message}\n${error.stack}`);  
    }    
}, 1000 * 60);

module.exports      = io;