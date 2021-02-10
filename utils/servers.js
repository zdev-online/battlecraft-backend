const servers = require('../servers.json');
const gamedig = require('gamedig');

module.exports.getServers = async () => {
    let serversInfo = [];
    for(let i = 0; i < servers.length; i++){
        let info = await gamedig.query({ type: "minecraft", host: servers[i] });
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
    let info = await gamedig.query({ type: "minecraft", host: servers[id] });
    return {
        max_players: info.maxplayers,
        host: info.connect,
        name: info.name,
        players: info.players.length
    };
}