const { Server }    = require('socket.io');
const servers       = require('../utils/servers');

const io            = new Server();

io.on('connection', (socket) => {

    socket.on('get_servers_info', async (callback) => {
        try {
            let serverInfo = await servers.getServers();
            callback(false, serverInfo);
        } catch (error) { return callback(error.message, null); }
    });

    socket.on('disconnect', (reason) => {
        console.log(`Socket-Client disconnect: ${reason}`);
    });
});

module.exports      = io;