const { Server }    = require('socket.io');
const servers       = require('../utils/servers');

const io            = new Server();

io.on('connection', (socket) => {

    socket.on('get_servers_info', async (callback) => {
        try {
            let serverInfo = await servers.getServers();
            // Send info about servers 
        } catch (error) {

        }
    });

    socket.on('disconnect', (reason) => {
        console.log(`Socket-Client disconnect: ${reason}`);
    });
});

module.exports      = io;