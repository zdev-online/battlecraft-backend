const servers = require('../servers.json');
const gamedig = require('gamedig');
const Rcon    = require('modern-rcon');


module.exports.getServers = async () => {
    let serversInfo = [];
    for(let i = 0; i < servers.length; i++){
        let info = await gamedig.query({ type: "minecraft", host: servers[i].address }).catch((error) => {});
        serversInfo.push({
            max_players: info.maxplayers,
            host: info.connect,
            name: info.name,
            players: info.players.length
        });
    }
    return serversInfo;
}

module.exports.getServer = async (id) => {
    let info = await gamedig.query({ type: "minecraft", host: servers[id].address });
    return {
        max_players: info.maxplayers,
        host: info.connect,
        name: info.name,
        players: info.players.length
    };
}

module.exports.sendCommand = async (server, command) => {
    let [ ip, port ]    = server.address.split(':');
    let connection      = new Rcon(ip, port, server.password);
    await connection.connect();
    let data = await connection.send(command);
    await connection.disconnect();
    return data;
}