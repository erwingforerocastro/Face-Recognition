/**
 * Index principal
 * @author: Erwing FC erwingforerocastro@gmail.com
 */
// require('@tensorflow/tfjs - node');
const express = require('express');
const { MvfyHsv } = require('./mvfy/mvfy-hsv');
const { PORT } = require('./utils/constants');
const app = express();

// static files
app.use('/static', express.static(__dirname + '/public'));

//routes
app.get('/', function(req, res) {
    res.render('index');
});

//init server
const server = require('http').Server(app);


options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}
console.log(MvfyHsv)
const hsv = new MvfyHsv({ server: server, options: options });
hsv.connect()

server.listen(PORT, () => {
    console.log(`Listen Socket in port ${PORT}`);
})