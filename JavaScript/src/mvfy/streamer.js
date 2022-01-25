import cv from 'opencv4nodejs'
import { REQUEST, ACTION } from '../utils/constants'

export default ({
    io /** sockeio instance */ ,
    interval /**interval of image */ ,
    size = [300, 300] /**size of image W,H */
}) => {
    const wCap = new cv.VideoCapture(0)
    wCap.set(cv.CAP_PROP_FRAME_WIDTH, size[0])
    wCap.set(cv.CAP_PROP_FRAME_HEIGHT, size[1])
    console.log("capture")
    setInterval(() => {
        const frame = wCap.read();
        const _image = cv.imencode('.jpg', frame).toString('base64')
        io.emit(ACTION.SET_LOCAL_DETECTION, _image)
    }, interval);
}