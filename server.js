const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const NodeRSA = require('node-rsa');
const config = require('./config');
const utils = require('./utils');
const crypto = require('crypto');

var pemKey = false;

app.get('/get-credentials', (req, res) => {
    if (!pemKey) {
        res.status(500).json({message: 'Server not ready'});
        return;
    }
    var u = utils.makeUsername(config.usernameLength);
    var b = Buffer.from(u+ config.electionId, 'base64')
    var p = pemKey.sign(b, 'base64', 'base64');
    // p = crypto.createHmac('sha256', pwd).digest('hex');
    res.status(200).json({ u, p });
});

app.get('/get-pubkey', (req, res) => {
    if (!pemKey) {
        res.status(500).json({message: 'Server not ready'});
        return;
    }
    res.status(200).json({ key: pemKey.exportKey('public') });
});

fs.readFile(config.privateKeyFile, (err, data) => {
    if (err) {
        console.log('Unable to load pem file')
        process.exit(1);
    }
    pemKey = new NodeRSA(data);
    app.listen(port, () => console.log(`Trusted Organization app listening on port ${port}!`))
});
