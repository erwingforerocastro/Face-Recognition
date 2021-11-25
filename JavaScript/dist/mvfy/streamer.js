'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _opencv4nodejs = require('opencv4nodejs');

var _opencv4nodejs2 = _interopRequireDefault(_opencv4nodejs);

var _constants = require('../utils/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({ io, interval, size = [300, 300] }) => {
    const wCap = new _opencv4nodejs2.default.VideoCapture(0);
    wCap.set(_opencv4nodejs2.default.CAP_PROP_FRAME_WIDTH, size[0]);
    wCap.set(_opencv4nodejs2.default.CAP_PROP_FRAME_HEIGHT, size[1]);
    setInterval(() => {
        const frame = wCap.read();
        const _image = _opencv4nodejs2.default.imencode('.jpg', frame).toString('base64');
        io.emit(_constants.REQUEST.LOCAL_IMAGE_SEND, _image);
    }, interval);
};