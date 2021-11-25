'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mvfyHsv = require('./mvfy/mvfy-hsv');

var _mvfyHsv2 = _interopRequireDefault(_mvfyHsv);

var _constants = require('./utils/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Priincipal index
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @author: Erwing FC erwingforerocastro@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
// require('@tensorflow/tfjs - node');


const app = (0, _express2.default)();

//routes
app.get('/', (() => {
    var _ref = _asyncToGenerator(function* (req, res) {
        yield _mvfyHsv2.default.getStreamer(req, res);
    });

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})());

//init server
const server = require('http').Server(app);

options = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
};

console.log(_mvfyHsv2.default);

const hsv = new _mvfyHsv2.default({
    server: server,
    options: options,
    type_service: _mvfyHsv2.default.const.TYPE_SERVICE.REMOTE,
    min_date_knowledge: _mvfyHsv2.default.const.WEEKS(1),
    features: _mvfyHsv2.default.const.ALLOWED_FEATURES.ALL,
    type_system: _mvfyHsv2.default.const.TYPE_SYSTEM.OPTIMIZED,
    decoder: "utf-8",
    max_descriptor_distance: 0.7
});

// const hsv = new MvfyHsv({
//     server: server,
//     port: PORT,
//     options: options,
//     type_service: MvfyHsv.const.TYPE_SERVICE.REMOTE,
// });

hsv.start();

server.listen(_constants.PORT, () => {
    console.log(`Listen Socket in port ${_constants.PORT}`);
});