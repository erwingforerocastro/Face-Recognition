/**
 * Principal index
 * @author: Erwing FC erwingforerocastro@gmail.com
 */

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


let options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}


const hsv = new MvfyHsv({
    title: "system_01",
    server: server,
    options: options,
    type_system: MvfyHsv.const.TYPE_SYSTEM.OPTIMIZED,
    type_service: MvfyHsv.const.TYPE_SERVICE.LOCAL,
    min_date_knowledge: MvfyHsv.const.WEEKS(1),
    features: MvfyHsv.const.ALLOWED_FEATURES.ALL,
    decoder: "utf-8",
    max_descriptor_distance: 0.7
});

// const hsv = new MvfyHsv({
//     server: server,
//     port: PORT,
//     options: options,
//     type_service: MvfyHsv.const.TYPE_SERVICE.REMOTE,
// });


hsv.start({
    streamer: hsv.ip_cam_streamer('rtsp://mvfysystem:mvfysystem@192.168.1.7:8080/h264_ulaw.sdp')
})

server.listen(PORT, () => {
    console.log(`Listen Socket in port ${PORT}`);
})