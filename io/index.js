const { Server }    = require('socket.io');

const io            = new Server();

io.on('connection', (socket) => {

    socket.on('get_servers_info', () => {});

    socket.on('disconnect', (reason) => {
        console.log(`Socket-Client disconnect: ${reason}`);
    });
});

module.exports      = io;