const servers = require('../servers.json');
const gamedig = require('gamedig');

module.exports.getServers = () => {
    return new Promise(async (ok, err) => {
        try {
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
            return ok(serversInfo);
        } catch (error) { return err(error); }
    });
}

module.exports.getServer = (id) => {
    return new Promise(async (ok, err) => {
        try {
            let info = await gamedig.query({ type: "minecraft", host: servers[id] });
            return ok({
                max_players: info.maxplayers,
                host: info.connect,
                name: info.name,
                players: info.players.length
            });
        } catch (error) { return err(error); }
    });
}