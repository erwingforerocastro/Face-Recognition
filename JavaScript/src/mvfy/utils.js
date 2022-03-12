// import * as onvif from 'node-onvif'
const Stream =  require('node-rtsp-stream')
const onvif = require('node-onvif')

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

const set_ip_cam = async (options={}) => {

    let device = new onvif.OnvifDevice({
        xaddr: 'http://192.168.1.1:8080/onvif/device_service',
        user : 'mvfysystem',
        pass : 'mvfysystem'
    })
    await device.init()
    let url = device.getUdpStreamUrl()
    console.log(url);
    let stream = new Stream({
        name:'name',
        streamUrl: url,
        wsPort: 9000
    })
}

set_ip_cam()