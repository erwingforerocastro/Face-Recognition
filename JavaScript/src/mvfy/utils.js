// import * as onvif from 'node-onvif'
const Stream =  require('node-rtsp-stream')
const onvif = require('node-onvif')
const {spawn} = require("child_process")
// /**
//  * Discover ONVIF network cameras.
//  * @param {boolean} print 
//  */
// const get_ip_cams = (print=false) => {
//     onvif.startProbe().then((device_info_list)=>{
//         if(print){
//             console.log(`${device_info_list.length} devices were found`);

//             device_info_list.forEach((info) => {
//                 console.log(`- ${info.urn}`);
//                 console.log(`  - ${info.name}`);
//                 console.log(`  - ${info.xaddrs[0]}`);
//             })
//         }
        
//         return device_info_list
//     }).catch((error) => {
//         console.error(error);
//     })

// }

// const io = require('socket.io')

// const express = require('express')
// const app = express();
// const server = require('http').Server(app);

// let options = {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// }

// let conection = io(server, options)

// conection.on('connection', async(ws) => {
//     await set_ip_cam()
// })

const set_ip_cam = async (options={}) => {

    let device = new onvif.OnvifDevice({
        xaddr: 'http://192.168.1.7:8080/onvif/device_service',
        user : 'mvfysystem',
        pass : 'mvfysystem'
    })
    await device.init()
    let url = device.getUdpStreamUrl()
    console.log(url);
    let child = spawn('ffmpeg', ['-v', 'verbose', '-i', 'rtsp://mvfy:mvfy@192.168.1.7:8080/h264_ulaw.sdp', , '-vf', 'scale=1920:1080' ,'-vcodec', 'libx264', '-r', '30', '-b:v', '1000000', '-crf', '31', '-acodec', 'aac', '-sc_threshold', '0', '-f', 'hls', '-hls_time', '5', '-segment_time', '5', '-hls_list_size', '5', `/streaming.m3u8`] );
    child.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});
 
	child.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});
 
	child.on('close', function (code) {
		console.log('FFMpeg process exited with code ' + code);
	});
}

set_ip_cam()

// server.listen(9000, () => {
//     console.log(`Listen Socket in port ${9000}`);
// })
