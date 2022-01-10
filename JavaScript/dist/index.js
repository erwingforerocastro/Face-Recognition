"use strict";

var _express = _interopRequireDefault(require("express"));

var _mvfyHsv = _interopRequireDefault(require("./mvfy/mvfy-hsv"));

var _constants = require("./utils/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Priincipal index
 * @author: Erwing FC erwingforerocastro@gmail.com
 */
// require('@tensorflow/tfjs - node');
const app = (0, _express.default)(); //routes

app.get('/', async function (req, res) {
  await _mvfyHsv.default.getStreamer(req, res);
}); //init server

const server = require('http').Server(app);

let options = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
};
const hsv = new _mvfyHsv.default({
  server: server,
  options: options,
  type_service: _mvfyHsv.default.const.TYPE_SERVICE.REMOTE,
  min_date_knowledge: _mvfyHsv.default.const.WEEKS(1),
  features: _mvfyHsv.default.const.ALLOWED_FEATURES.ALL,
  type_system: _mvfyHsv.default.const.TYPE_SYSTEM.OPTIMIZED,
  decoder: "utf-8",
  max_descriptor_distance: 0.7
}); // const hsv = new MvfyHsv({
//     server: server,
//     port: PORT,
//     options: options,
//     type_service: MvfyHsv.const.TYPE_SERVICE.REMOTE,
// });

hsv.start();
server.listen(_constants.PORT, () => {
  console.log(`Listen Socket in port ${_constants.PORT}`);
});