import * as cv from 'opencv4nodejs'

const ip_cam_streamer = async(url) => {
    const interval = Math.round(1000 / this._stream_fps)
    wCap = cv.VideoCapture(url)
    return setInterval(async() => {
        const frame = wCap.read();
        let process_frame = await this.middlewareDetection(frame)
        const _image = cv.imencode('.jpg', process_frame).toString('base64')
        this.io.emit(ACTION.SEND_IMAGE_CLIENT, _image)
    }, interval);
}