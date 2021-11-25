/**  
 * @license
 * MvFy HSV: Modulo de seguridad visual
 * Copyright©Erwing Fc ~ erwingforerocastro@gmail.com All Rights Reserved.
 * Date: 2020-09-04
 * 
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('@tensorflow/tfjs-node');

var _canvas = require('canvas');

var canvas = _interopRequireWildcard(_canvas);

var _faceApi = require('face-api.js');

var faceapi = _interopRequireWildcard(_faceApi);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fileSystem = require('file-system');

var _fileSystem2 = _interopRequireDefault(_fileSystem);

var _fastJsonStableStringify = require('fast-json-stable-stringify');

var _fastJsonStableStringify2 = _interopRequireDefault(_fastJsonStableStringify);

var _string_decoder = require('string_decoder');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _streamer = require('./streamer');

var _streamer2 = _interopRequireDefault(_streamer);

var _constants = require('../utils/constants');

var constants = _interopRequireWildcard(_constants);

var _index = require('../use-cases/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData


//constants


class MvfyHsv {

    /**
     * Main model builder
     * @constructor
     * @param {Object} args
     * @param {*} args.server - Backend server for the websocket. 
     * @param {Object} args.options - options for the websocket.
     * @param {Any|Number} args.port - Server listen port.
     * @param {String} args.type_service - type of the listen server.
     * @param {Array} args.min_date_knowledge [min_date_knowledge=null] - minimum interval to determine a known user.
     * @param {Number} args.min_frequency [min_frequency=0.7] - minimum frequency between days detectioned.
     * @param {String} args.features [features=null] - characteristics that will be saved in each detection.
     * @param {String} args.decoder [decoder='utf-8'] - data decoder.
     * @param {String} args.max_descriptor_distance [max_descriptor_distance=null] - max distance of diference between detections.
     * @param {String} args.type_system [type_system=null] - type of system.
     */
    constructor(args = {}) {

        let { server, options } = args,
            otherInfo = _objectWithoutProperties(args, ['server', 'options']);
        //create or return system of bd

        this._require_create = otherInfo.type_service == constants.TYPE_SERVICE.LOCAL;
        this.type_service = otherInfo.type_service; //*required
        this.port = otherInfo.port;
        this.domain = "localhost";
        this._stream_fps = 30;
        this.id = null;
        this.features = null;
        this.min_date_knowledge = null;
        this.min_frequency = 0.7;
        this.decoder = 'utf-8';
        this.max_descriptor_distance = null;
        this.type_system = null;
        this.execution = false;
        this.type_model_detection = null;

        this._insert(otherInfo);

        if (server == null || options == null) {
            throw new Error("server and options argument is required");
        }

        this.io = (0, _socket2.default)(server, options);
    }

    /**
     * Change fps of stream video
     * @param {number} fps 
     */
    change_video_fps(fps) {
        if (typeof fps == "number") {
            this._stream_fps = fps;
        } else {
            throw new Error("Invalid fps of video");
        }
    }

    /**
     * Init system in backend process
     */
    start() {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (_this._require_create) {
                system = yield _this._create(_this.values);
                _this._insert(system);
            }

            if (_this.type == constants.TYPE_SERVICE.LOCAL && _this.id == null) {
                throw new Error("Required initialize system");
            }

            _this.io.on('connection', function (ws) {
                return _this.ws(ws);
            });

            if (_this.type == constants.TYPE_SERVICE.LOCAL) {
                (0, _streamer2.default)({
                    io: _this.io,
                    interval: Math.round(1000 / _this._stream_fps)
                });
            }
            _this.execution = true;
        })();
    }

    /**
     * Create system
     * @param {Object} data 
     * @return {Object} system
     */
    _create(data) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            let system = _this2.values;
            const similarSystem = yield getSystem(data);

            if (similarSystem != null) {
                system = similarSystem;
            } else {
                system = yield (0, _index.addSystem)(data);
            }
            return system;
        })();
    }

    /**
     * Update data of actual system
     * @param {Object} data Data to be update system
     */
    _update(data) {
        let _ref = this,
            { id } = _ref,
            otherInfo = _objectWithoutProperties(_ref, ['id']);
        let system = (0, _index.updateSystem)(_extends({}, data, {
            id
        }));
        this._insert(system);
    }

    /**
     * Insert data in actual instance of system
     * @param {Object} system Data of system
     */
    _insert(system) {
        ({
            id: this.id = this.id,
            min_date_knowledge: this.min_date_knowledge = this.min_date_knowledge,
            features: this.features = this.features,
            type_system: this.type_system = this.type_system,
            type_model_detection: this.type_model_detection = this.type_model_detection,
            decoder: this.decoder = this.decoder,
            max_descriptor_distance: this.max_descriptor_distance = this.max_descriptor_distance
        } = system);
    }

    /**
     * Funcion para retornar el estado actual del sistema
     * @return {Object} objeto con algunos atributos del sistema
     */
    get values() {

        return {
            id: this.id,
            min_date_knowledge: this.min_date_knowledge,
            features: this.features,
            type_system: this.type_system,
            type_model_detection: this.type_model_detection,
            decoder: this.decoder,
            max_descriptor_distance: this.max_descriptor_distance
        };
    }

    /**
     * Iniciar las configuraciones iniciales del sistema 
     * @return {FaceMatcher}
     *  
     */
    preloadSystem() {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            // validamos que el archivo exista
            if (!_fileSystem2.default.existsSync(MATCH_FILE)) {

                _fileSystem2.default.writeFileSync(MATCH_FILE, (0, _fastJsonStableStringify2.default)({}), function (err) {
                    if (err) {
                        throw new Error(`Error ${err}`);
                    }
                });
            }

            let data = (0, _fastJsonStableStringify2.default)(_this3);

            //validamos el archivo de rostros
            if (!_fileSystem2.default.existsSync(CONFIG_FILE)) {

                _fileSystem2.default.writeFileSync(CONFIG_FILE, data, function (err) {
                    if (err) {
                        throw new Error(`Error ${err}`);
                    }
                });
            }

            yield loadExternalModels(_this3.features, _this3.type_system);
        })();
    }

    /**
     * Load models and initialize video
     * @param {String} features variable con la caracteristica adicional a la predicción
     * @param {String} type_system tipo de sistema optimo o preciso
     */
    loadExternalModels(features, type_system) {
        return _asyncToGenerator(function* () {
            const url = constants.MODELS_URL;

            try {

                yield faceapi.loadFaceRecognitionModel(url);

                if (type_system == 'optimized') {
                    yield faceapi.nets.tinyFaceDetector.loadFromUri(url);
                } else {
                    yield faceapi.nets.ssdMobilenetv1.loadFromUri(url);
                }

                let array_features = Array.isArray(features) ? features : [features];

                yield faceapi.nets.faceLandmark68Net.loadFromUri(url);

                array_features.forEach((() => {
                    var _ref2 = _asyncToGenerator(function* (v) {
                        if (v == 'all') {
                            yield faceapi.nets.faceExpressionNet.loadFromUri(url);
                            yield faceapi.nets.ageGenderNet.loadFromUri(url);
                        } else if (v == 'ageandgender') {
                            yield faceapi.nets.ageGenderNet.loadFromUri(url);
                        } else if (v == 'expressions') {
                            yield faceapi.nets.faceExpressionNet.loadFromUri(url);
                        }
                    });

                    return function (_x) {
                        return _ref2.apply(this, arguments);
                    };
                })());
            } catch (error) {
                throw new Error(`Error: ${error} `);
            }
        })();
    }

    /**
     * Detect faces and tag them
     * @param {String} route ruta de guardado de las imagenes
     * @param {Array} labels nombre u etiqueta de las imagenes de los usuarios
     * @return {FaceMatcher}
     *  
     */
    labelsMatchers(route, labels) {
        var _this4 = this;

        return _asyncToGenerator(function* () {

            const labeledFaceDescriptors = yield Promise.all(labels.map((() => {
                var _ref3 = _asyncToGenerator(function* (label, index) {

                    // convertir en un HTMLImageElement
                    const imgUrl = `${route}/${label}` || `${route}${label}`;
                    const img = yield face_api.fetchImage(imgUrl);

                    // detecta la cara con la puntuación más alta en la imagen 
                    //y calcula sus puntos de referencia y el descriptor de la cara
                    const fullFaceDescription = yield faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

                    if (!fullFaceDescription) {
                        throw new error(`no faces detected for ${label}`);
                    }

                    const faceDescriptors = [fullFaceDescription.descriptor];
                    return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
                });

                return function (_x2, _x3) {
                    return _ref3.apply(this, arguments);
                };
            })()));

            return new faceapi.FaceMatcher(labeledFaceDescriptors, _this4.max_descriptor_distance);
        })();
    }

    /**
     * Function for init the system
     * @param {Object} data 
     */
    initSystem(data) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            try {
                let system = yield _this5._create(data);
                _this5._insert(system);

                let matches = (0, _index.getUsers)({
                    query: {
                        idSystem: system.id
                    }
                });

                matches = matches != null ? matches : [];

                _this5.io.send((0, _fastJsonStableStringify2.default)({
                    action: constants.REQUEST.SEND_DETECTION_VALIDATED,
                    data: {
                        system_id: system.id,
                        matches: matches
                    }
                }));
            } catch (error) {
                _this5.io.send((0, _fastJsonStableStringify2.default)({
                    action: constants.REQUEST.ERROR,
                    data: {
                        error: `Error in initSystem ${error}`
                    }
                }));
            }
        })();
    }

    /**
     * Evaluate detection of face user
     * @param {Object} user 
     */
    evaluateDetection(user) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            let prevUser = user;
            let diffDate = utils.getDateDiffSoFar(user.init_date, _this6.values.min_date_knowledge[1] /** type of date see MvFyHsv.const  */);
            if (diffDate > _this6.values.min_date_knowledge[0] /**quantity of date's type */ && user.frequency >= _this6.values.frequency /**user's frequency is more bigger that system */) {
                    user.knowledge = true;
                } else if (utils.getDateDiffSoFar(user.last_date, _this6.values.min_date_knowledge[1], true) > 0) {
                // las date is other date's type (eje. days)
                let prevDays = utils.frequency(_this6.values.min_date_knowledge[0], 1, _this6.frequency, true); // previous count of date's type (eje. days)
                user.last_date = utils.getActualDate();
                user.frequency = utils.frequency(_this6.values.min_date_knowledge[0], 1, prevDays + 1); // add this date's type (eje. days)
            }

            return prevUser !== user ? yield (0, _index.updateUser)(_extends({}, user, {
                modified_on: utils.getActualDate()
            })) : user;
        })();
    }

    /**
     * Evaluate new detection
     * @param {Object} user 
     */
    setDetection(user) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            try {
                let _user = user;
                if (user.id != null && user.detection != null) {
                    let exist_user = yield (0, _index.getUser)({
                        query: {
                            system_id: _this7.values.id,
                            detection: user.detection
                        }
                    });

                    if (exist_user) {
                        _user = yield _this7.evaluateDetection(exist_user);
                    } else {
                        _user = yield (0, _index.addUser)(_extends({}, user, {
                            modified_on: utils.getActualDate(),
                            created_on: utils.getActualDate()
                        }));
                    }
                }
                _this7.io.send((0, _fastJsonStableStringify2.default)({
                    action: constants.REQUEST.SEND_DETECTION_VALIDATED,
                    data: {
                        user: _user
                    }
                }));
            } catch (error) {
                _this7.io.send((0, _fastJsonStableStringify2.default)({
                    action: constants.REQUEST.ERROR,
                    data: {
                        error: `Error validation user - ${user.author} \n: ${error}`
                    }
                }));
            }
        })();
    }

    /**
     * Websocket - initizalize receiver 
     * @param {SocketIO} socket 
     */
    ws(socket) {
        var _this8 = this;

        console.log("websocket connect");
        socket.on("message", (() => {
            var _ref4 = _asyncToGenerator(function* (json) {
                return yield _this8.receiver(json);
            });

            return function (_x4) {
                return _ref4.apply(this, arguments);
            };
        })());
    }

    /**
     * Websocket - manage receiver
     * @param {String} json 
     */
    receiver(json) {
        var _this9 = this;

        return _asyncToGenerator(function* () {
            let data = JSON.parse(json);
            switch (data.action) {
                case ACTIONS.INIT_SYSTEM:
                    yield _this9.initSystem(data.data);
                    break;
                case ACTIONS.SET_DETECTION:
                    yield _this9.setDetection(data.data);
                    break;
            }
        })();
    }

    /**
     * use callback of express app for return stream video local
     * @param {Any} req 
     * @param {Any} res 
     */
    static getStreamer(req, res) {
        return _asyncToGenerator(function* () {

            yield _fileSystem2.default.readFile(constants.HTML_STREAMER.URL, 'utf-8', (() => {
                var _ref5 = _asyncToGenerator(function* (err, data) {
                    if (err) throw err;

                    let keys = [constants.HTML_STREAMER.PORT_REPLACE, constants.HTML_STREAMER.DOMAIN_REPLACE, constants.HTML_STREAMER.EMIT_REPLACE];
                    let values = [req.app.settings.port, req.host, constants.LOCAL_IMAGE_SEND];

                    let newData = replaceValues(data, keys, values);

                    yield _fileSystem2.default.writeFile(constants.HTML_STREAMER.URL, newData, 'utf-8', function (err) {
                        if (err) throw err;
                    });
                });

                return function (_x5, _x6) {
                    return _ref5.apply(this, arguments);
                };
            })());

            res.sendFile(constants.HTML_STREAMER);
        })();
    }
}

MvfyHsv.const = Object.freeze(_extends({}, constants));

exports.default = MvfyHsv;