const config = require('./config');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('OK');
});

app.post('/', (req, res) => {
    if (req.headers.authorization === config.VERIFICATION_TOKEN) {       
        if (typeof req.body.event != 'undefined'){
            res.status(200).send();
            events(req.body);            
        } else {
            res.status(400).end('Bad Request');
            console.error('router | invalid post request');
        }
    } else {
        res.status(403).end('Forbidden');
        console.error('router | invalid authorization');
    }  
});

app.use((req, res, next) => {
    console.log('router | 404');
    res.sendStatus(404);
});

const events = (req) => {
    console.log('event | processing | ' + req.event);

    if (typeof req.payload != 'undefined'){
        if (typeof req.payload.object != 'undefined'){
            console.log('event | ' + req.event + ' | processing');
            if (req.event == 'recording.completed'){
                if (fs.existsSync('./' + req.event + '.js')){
                    require('./' + req.event)(req.download_token, req.payload);
                } else {
                    console.log('event | ' + req.event + ' | no event handler');
                }
            }
        } else {
            console.log('event | ' + req.event + ' | no payload object');
        }        
    } else {
        console.log('event | ' + req.event + ' | no payload');
    }
}

app.listen(config.port, () => {
    console.log('listen on ' + config.port);
})