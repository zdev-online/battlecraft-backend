const { Server }    = require('socket.io');
const servers       = require('../utils/servers');

const io            = new Server();
let serversInfo     = [];

io.on('connection', (socket) => {

    // Обновление информации о серверах!
    socket.on('get_servers_info', () => socket.emit('get_servers_info', serversInfo));

    socket.on('disconnect', (reason) => {
        console.log(`Socket-Client disconnect: ${reason}`);
    });
});

const fetchServersInfo = async () => {
    try {
        serversInfo = await servers.getServers();
    } catch (error) {
        console.log(`Не удалось получить информацию о серверах: ${error.message}\n${error.stack}`);  
    }

    setInterval(fetchServersInfo, 1000 * 60);
}

fetchServersInfo();

module.exports      = io;
