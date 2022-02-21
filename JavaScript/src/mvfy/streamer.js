import cv from 'opencv4nodejs'
import { REQUEST, ACTION } from '../utils/constants'

export default ({
    io /** sockeio instance */ ,
    interval /**interval of image */ ,
    size = [300, 300] /**size of image W,H */ ,
    middleware
}) => {
    const wCap = new cv.VideoCapture(0)
    wCap.set(cv.CAP_PROP_FRAME_WIDTH, size[0])
    wCap.set(cv.CAP_PROP_FRAME_HEIGHT, size[1])
    console.log("capture")
    return setInterval(() => {
            const frame = wCap.read();
            let process_frame = middleware(frame)
            const _image = cv.imencode('.jpg', process_frame).toString('base64')
            io.emit(ACTION.SET_LOCAL_DETECTION, _image)
        },
        interval);

}