const servers = require('../servers.json');
const gamedig = require('gamedig');
const RCON    = require('modern-rcon');

const serversById = {};
const serversInfoForClient = [];

for (let i = 0; i < servers.length; i++) {
    serversById[servers[i].model_name] = servers[i];
    serversInfoForClient.push({ name: servers[i].name, ip: servers[i].address, id: servers[i].model_name });
}

module.exports.getServers = async () => {
    let serversInfo = [];
    for(let i = 0; i < servers.length; i++){
        let info = await gamedig.query({ type: "minecraft", host: servers[i].address }).catch((error) => {});
        if(!info){ 
            serversInfo.push({ inactive: true });
            continue;   
        }
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
    let info = await gamedig.query({ type: "minecraft", host: servers[id].address }).catch(() => {});
    if(!info){ return { inactive: true } }
    return {
        max_players: info.maxplayers,
        host: info.connect,
        name: info.name,
        players: info.players.length
    };
}

module.exports.sendCommand = async (server, command) => {
    let { host, port, password }    = server.rcon;
    let connection                  = new RCON(host, Number(port), password);
    await connection.connect();
    let data = await connection.send(command);
    await connection.disconnect();
    return data;
}

module.exports.getData = (id) => serversById[id] ? serversById[id] : false;

module.exports.getDataForClient = (req, res) => res.json(serversInfoForClient); 

module.exports.isValidPrivilege = (string) => ["vip", "premium", "ultra", "legend", "supreme", "sponsor"].includes(string);
