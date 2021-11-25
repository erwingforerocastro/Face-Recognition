/**
 * Priincipal index
 * @author: Erwing FC erwingforerocastro@gmail.com
 */
// require('@tensorflow/tfjs - node');
import express from 'express'
import MvfyHsv from './mvfy/mvfy-hsv';
import { PORT } from './utils/constants';
const app = express();


//routes
app.get('/', async function(req, res) {
    await MvfyHsv.getStreamer(req, res)
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

const hsv = new MvfyHsv({
    server: server,
    options: options,
    type_service: MvfyHsv.const.TYPE_SERVICE.REMOTE,
    min_date_knowledge: MvfyHsv.const.WEEKS(1),
    features: MvfyHsv.const.ALLOWED_FEATURES.ALL,
    type_system: MvfyHsv.const.TYPE_SYSTEM.OPTIMIZED,
    decoder: "utf-8",
    max_descriptor_distance: 0.7
});

// const hsv = new MvfyHsv({
//     server: server,
//     port: PORT,
//     options: options,
//     type_service: MvfyHsv.const.TYPE_SERVICE.REMOTE,
// });

hsv.start()


server.listen(PORT, () => {
    console.log(`Listen Socket in port ${PORT}`);
})