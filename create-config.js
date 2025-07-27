const { Config } = require('./dist/config/config.js');
const fs = require('fs');

const config = new Config();
config.admins[0].password = 'admin123';
config.rconPassword = 'temp-rcon-password';
config.ingameApiKey = 'temp-api-key';
config.serverCfg.passwordAdmin = 'admin123';

fs.writeFileSync('./exec/server-manager.json', JSON.stringify(config, null, 2));
console.log('Config created successfully');