(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (global = global || self, factory(global.MvfyHsv = global.MvfyHsv || {}));
}(this, (function(exports) {

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

    /**
     * @constant
     * @type {Object}
     */
    var environment;

    // <----------------------------- FUNCTIONS OF ENVIROMENT ----------------------------->

    /**
     * Function for validate if enviroment is browser
     */
    function isBrowser() {
        return typeof window === 'object' &&
            typeof document !== 'undefined' &&
            typeof HTMLImageElement !== 'undefined' &&
            typeof HTMLCanvasElement !== 'undefined' &&
            typeof HTMLVideoElement !== 'undefined' &&
            typeof ImageData !== 'undefined' &&
            typeof CanvasRenderingContext2D !== 'undefined';
    }

    /**
     * Function for validate if enviroment is nodejs
     */
    function isNodejs() {
        return typeof global === 'object' &&
            typeof require === 'function' &&
            typeof module !== 'undefined'
            // issues with gatsby.js: module.exports is undefined
            // && !!module.exports
            &&
            typeof process !== 'undefined' && !!process.version;
    }

    /**
     * Function get actual enviroment
     */
    function getEnv() {
        if (!environment) {
            throw new Error('getEnv - environment is not defined, check isNodejs() and isBrowser()');
        }
        return environment;
    }

    /**
     * Function set properties of enviroment
     * @param {Object<any>} env 
     */
    function setEnv(env) {
        environment = env;
    }

    /**
     * Function get 
     */
    function getUtils() {
        let utils_global = {

            /**
             * Function convert <String> to <Int>
             * @param {String} string 
             * @returns {Number} 
             */
            convertString2Int: (string) => {
                let sub_string = string.match(/\d+/gi)
                return (sub_string) ? parseInt(sub_string.join("")) : 0
            },

            extractValidDate: (_date) => {
                const formats = [
                    ``
                ]
            },
        }

        let utils_browser = {

        }

        let utils_node = {
            validateTypes: (_type, _valid_types) => {

            },

            /**
             * Function for obtain actual date
             * @param {String} _format - valid format see https://momentjs.com/docs/#/parsing/string-format/
             * @return {String}
             */
            getActualDate: (_format = DATE_FORMAT) => {
                return environment.moment().format(format)
            },
            /**
             * Function for get diference between a date and now
             * @param {String} _date - date
             * @param {String} _type - valid type see {link}
             * @return {Number} 
             */
            getDateDiffSoFar: (_date, _type) => {
                let date = environment.moment(_date)
                let date_now = this.getActualDate()
                if (date) {
                    return
                } else {
                    throw new TypeError(`getDateDiffSoFar - Invalid date ${_date}`)
                }
            }
        }

        utils_browser = {...utils_global, ...utils_browser }
        utils_node = {...utils_global, ...utils_node }

        setEnv({
            utils: (enviroment.type === 'browser') ? utils_browser : utils_node,
            ...environment
        })
    }

    function initialize() {
        // check for isBrowser() first to prevent electron renderer process
        // to be initialized with wrong environment due to isNodejs() returning true
        if (isBrowser()) {
            setEnv({
                type: "browser",
                ...createBrowserEnv()
            });
        }
        if (isNodejs()) {
            setEnv({
                type: "node",
                utils: utils,
                ...createNodejsEnv()
            });
        }

        getUtils()
    }

    function createNodejsEnv() {

        const fs = require('fs');
        const face_api = require('./face-api');
        const mongo = require('../controllers/mongo.controller.js');
        const mongodb = require('mongodb');
        const path = require('path');
        const stringify = require('fast-json-stable-stringify');
        const { StringDecoder } = require('string_decoder');
        const SocketIO = require("socket.io");
        const moment = require('moment');

        const MODELS_URL = path.join(__dirname, '/mvfy/models');
        const CONFIG_URL = path.join(__dirname, '/../config');


        return {
            fs: fs,
            face_api: face_api,
            mongo: mongo,
            mongodb: mongodb,
            path: path,
            stringify: stringify,
            StringDecoder: StringDecoder,
            SocketIO: SocketIO,
            moment: moment,
            UNKNOWS_URL: UNKNOWS_URL,
            ACQUAINTANCES_URL: ACQUAINTANCES_URL,
            MODELS_URL: MODELS_URL,
            CONFIG_URL: CONFIG_URL
        }
    }

    function createBrowserEnv() {

        const MODELS_URL = "models";
        const CONFIG_URL = "config";


        return {
            MODELS_URL: MODELS_URL,
            CONFIG_URL: CONFIG_URL
        }
    }

    initialize()

    // <----------------------------- CONSTANTS ----------------------------->

    const MODELS_URL = environment.MODELS_URL;
    const CONFIG_URL = environment.CONFIG_URL;
    const DATE_FORMAT = "DD/MM/YYYY"
    const PORT = process.env.PORT || 3000;
    const ALLOWED_FEATURE = ['all', 'ageandgender', 'expressions', 'none'];
    const MIN_DATE_KNOWLEDG = ['1', 'week'];
    const TYPE_SYSTE = ['optimized', 'precise'];
    const KEY_ARGUMENT = ['min_date_knowledge', 'file_extension', 'features', 'type_system'];
    const VALID_TYPE_DAT = ["day", "week", "month", "year"];
    const ACTION = {
        INIT_SYSTEM: "INIT_SYSTEM",
        SET_DETECTION: "SET_DETECTION",
    };
    const REQUEST = {
        ERROR: "ERROR",
        GET_MODEL_FEATURES: "GET_MODEL_FEATURES",
        GET_INITIALIZED_SYSTEM: "GET_INITIALIZED_SYSTEM"
    };
    const collection = {
        SYSTEMS: "systems",
        USERS: "users"
    };

    // <----------------------------- VALIDATE ENVIROMENT ----------------------------->

    if (environment.type === "node") {

        class MvfyHsv {

            // "use strict";

            /**
             * Constructor principal del modelo
             * @param {String} name nombre personalizado del sistema
             * @param {String} name_file nombre del archivo donde se guardaran las detecciones
             */
            constructor(args = {}) {

                let { server, options } = args

                this.min_date_knowledge = MIN_DATE_KNOWLEDGE
                this.features = ALLOWED_FEATURES[0]
                this.type_system = TYPE_SYSTEM[0]
                this.type_model_detection = ""
                this.decoder = 'utf-8'
                this.max_descriptor_distance = 0.7
                this.bd = environment.mongo;
                this.execution = false;
                this.io = environment.SocketIO(server, options)

            }

            /**
             * Funcion para retornar el estado actual del sistema
             * @return {Object} objeto con algunos atributos del sistema
             */
            get attributes() {

                return {
                    minimum_date_of_knowledge: this.min_date_knowledge,
                    features: this.features,
                    type_system: this.type_system,
                    execution: (this._execution) ? 'System on' : 'System off'
                };
            }

            /**
             * Validaciones
             * @param {String} type el tipo de dato necesario o argumento requerido
             * @return {Error} mensaje de error indicando el tipo erroneo o falta de variable
             *  
             */
            isRequired(type = null) {

                throw new Error(
                    (type !== null) ? `Missing parameter. Expected ${type}` : `Missing parameter`
                );
            }

            /**
             * Validaciones de una instancia
             * @param {Object} args argumentos de la instancia de MvfyHsv
             * @return {Array} contiene la validacion y el valor ej: [[true,'nuevo sistema'], ...]
             *  
             */
            validateInstance(args = {}) {

                const validator = {
                    validate_decoder: (decoder) => {
                        if (typeof(decoder) === 'string') {
                            let _decoder = new StringDecoder(decoder);
                            return [true, _decoder];
                        }

                        isRequired('decoder [String]');
                        return [false];
                    },
                    validate_max_descriptor_distance: (distance) => {
                        if (typeof(distance) === "number" && (distance > 0 && distance < 1)) {
                            return [true, distance];
                        }
                        isRequired('max_descriptor_distance [Number] (min:0.1, max:0.9)');
                        return [false];
                    },
                    validate_min_date_knowledge: (date) => {
                        let pattern1 = new RegExp(`${VALID_TYPE_DATE.join("(s)*|")}`, "g")
                        let pattern2 = new RegExp(`^\d+ *${pattern1}`, "g")
                        if (Array.isArray(date)) {
                            if (parseInt(date[0]) !== NaN && date[1].test(pattern1)) {

                                date = [date[0], date[1]];
                                return [true, date];
                            }

                        } else if (typeof(date) === 'string') {
                            date = date.match(pattern2) || MIN_DATE_KNOWLEDGE;
                            return [true, date];
                        }

                        isRequired('min_date_knowledge [String or Array], permissible: ["1", "month"] or "1 week"');
                        return [false];
                    },
                    validate_features: (features) => {
                        if ((typeof(features) === 'string' || Array.isArray(features)) && ALLOWED_FEATURES.includes(features)) {
                            return [true, features];
                        }
                        isRequired('features [String or Array], permissible [all, ageAndgender, expressions, none]');
                        return [false];
                    },
                    validate_type_system(type_system) {
                        if (typeof(type_system) === 'string' && TYPE_SYSTEM.includes(type_system)) {
                            return [true, type_system];
                        }
                        isRequired('type_system [String], permissible [optimized, precise]');
                        return [false];
                    }
                }

                let total_validations = {};
                let validate_args = [];
                const keys_validator = Object.keys(validator);

                keys_validator.forEach((v, i) => {
                    let name = v.split("validate_")[1];
                    let value = (args[`${name}`]) ? validator[`${v}`](args[`${name}`]) : validator[`${v}`]("");
                    total_validations[`${name}`] = value[1];
                    validate_args.push(value[0])
                });


                if (validate_args.reduce((acc, el) => acc && el)) {

                    ({
                        min_date_knowledge: this.min_date_knowledge = this.min_date_knowledge,
                        features: this.features = this.features,
                        type_system: this.type_system = this.type_system,
                        decoder: this.decoder = this.decoder
                    } = {...total_validations });

                } else {
                    return new Error('Instancia no valida, verfique las caracteristicas del modelo')
                }

            }

            /**
             * Iniciar las configuraciones iniciales del sistema 
             * @return {FaceMatcher}
             *  
             */
            async preloadSystem() {
                // validamos que el archivo exista
                if (!fs.existsSync(MATCH_FILE)) {

                    fs.writeFileSync(MATCH_FILE, stringify({}), (err) => {
                        if (err) {
                            throw new Error(`Error ${err}`);
                        }
                    })
                }

                let data = stringify(this)

                //validamos el archivo de rostros
                if (!fs.existsSync(CONFIG_FILE)) {

                    fs.writeFileSync(CONFIG_FILE, data, (err) => {
                        if (err) {
                            throw new Error(`Error ${err}`);
                        }
                    })
                }

                await loadExternalModels(this.features, this.type_system)

            }

            /**
             * Cargar los modelos e iniciar video
             * @param {String} features variable con la caracteristica adicional a la predicción
             * @param {String} type_system tipo de sistema optimo o preciso
             */
            async loadExternalModels(features, type_system) {
                const url = MODELS_URL;

                try {

                    await faceapi.loadFaceRecognitionModel(url)

                    if (type_system == 'optimized') {
                        await faceapi.nets.tinyFaceDetector.loadFromUri(url);
                    } else {
                        await faceapi.nets.ssdMobilenetv1.loadFromUri(url);
                    }

                    let array_features = (Array.isArray(features)) ? features : [features]

                    await faceapi.nets.faceLandmark68Net.loadFromUri(url)

                    array_features.forEach(async v => {
                        if (v == 'all') {
                            await faceapi.nets.faceExpressionNet.loadFromUri(url)
                            await faceapi.nets.ageGenderNet.loadFromUri(url)
                        } else if (v == 'ageandgender') {
                            await faceapi.nets.ageGenderNet.loadFromUri(url)
                        } else if (v == 'expressions') {
                            await faceapi.nets.faceExpressionNet.loadFromUri(url)
                        }
                    })
                } catch (error) {
                    throw new Error(`Error: ${error} `)
                }

            }

            /**
             * Detect faces and tag them
             * 
             * @param {String} route ruta de guardado de las imagenes
             * @param {Array} labels nombre u etiqueta de las imagenes de los usuarios
             * @return {FaceMatcher}
             *  
             */
            async labelsMatchers(route, labels) {

                const labeledFaceDescriptors = await Promise.all(
                    labels.map(async(label, index) => {

                        // convertir en un HTMLImageElement
                        const imgUrl = `${route}/${label}` || `${route}${label}`;
                        const img = await face_api.fetchImage(imgUrl);

                        // detecta la cara con la puntuación más alta en la imagen 
                        //y calcula sus puntos de referencia y el descriptor de la cara
                        const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

                        if (!fullFaceDescription) {
                            throw new error(`no faces detected for ${label}`);
                        }

                        const faceDescriptors = [fullFaceDescription.descriptor];
                        return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
                    }))


                const maxDescriptorDistance = 0.7;
                return new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

            };

            /**
             * Function for init the system
             * @param {Object} data 
             */
            async initSystem(data) {
                try {
                    let ObjectId = environment.mongodb.ObjectId
                    let system = null
                    this.validateInstance(data)
                    if (data.id == null) {
                        let { id, ...all_data } = data
                        let result = await this.bd.insert(collections.SYSTEMS, all_data)
                        system = result.ops[0]
                    } else {
                        let _system = await this.bd.find(collections.SYSTEMS, {
                            _id: new ObjectId(data.id)
                        });
                        if (_system.length > 0) {
                            system = _system[0]
                        } else {
                            let { id, ...all_data } = data
                            let result = await this.bd.insert(collections.SYSTEMS, all_data)
                            system = result.ops[0]
                        }
                    }

                    let matches = this.bd.find(collections.USERS, {
                        id: data.id
                    })

                    matches = (Object.keys(matches) > 0) ? matches : []

                    this.io.send(stringify({
                        action: REQUEST.GET_INITIALIZED_SYSTEM,
                        data: {
                            id: system._id,
                            matches: matches
                        }
                    }))
                } catch (error) {
                    this.io.send(stringify({
                        action: REQUEST.ERROR,
                        data: {
                            error: `Error in initSystem ${error}`
                        }
                    }))
                }
            }
            async evaluate_detection(user) {
                let detection = this.bd.update(collections.USERS, {
                    _id: new ObjectId(exist_user._id)
                }, {
                    history: enviroment.convertString2Int(exist_user.history) + 1
                })
                console.log("detection insert", detection)
            }
            async setDetection(data) {
                let ObjectId = enviroment.mongodb.ObjectId
                try {
                    if (data.id != null && data.label != null) {
                        let exist_user = await this.bd.findOne(collections.USERS, {
                            label: data.label,
                            system_id: data.id
                        })

                        if (exist_user) {
                            await this.evaluate_detection(exist_user)
                        } else {
                            await this.bd.insert(collection.USERS, {
                                system_id: data.id,
                                label: data.label,
                                gener: data.gener,
                                age: data.age,
                                history: 0,
                                knowledge: false,
                                end_date: enviroment.moment()
                            })
                        }
                    }
                } catch (error) {
                    this.io.send(stringify({
                        action: REQUEST.ERROR,
                        data: {
                            error: `Error insert detection ${error}`
                        }
                    }))
                }
            }

            connect() {
                this.io.on('connection', (ws) => this.ws(ws))
            }
            ws(socket) {
                console.log("websocket connect")
                socket.on("message", (json) => this.receiver(json))
            }
            receiver(json) {
                let data = JSON.parse(json)
                switch (data.action) {
                    case ACTIONS.INIT_SYSTEM:
                        this.initSystem(data.data)
                        break;
                    case ACTIONS.SET_DETECTION:
                        this.setDetection(data.data)
                        break;
                }
            }


        }

        exports.MvfyHsv = MvfyHsv

    } else if (environment.type === "browser") {
        $.getScript('mvfy/socket.io.min.js')
        $.getScript('mvfy/face-api.js')
        class MvfyHsv {

            /**
             * Principal constructor of class
             * @param {String} name nombre personalizado del sistema
             * @param {String} name_file nombre del archivo donde se guardaran las detecciones
             */
            constructor(args) {

                this.id = null
                this.min_date_knowledge = MIN_DATE_KNOWLEDGE
                this.features = ALLOWED_FEATURES[0]
                this.type_system = TYPE_SYSTEM[0]
                this._execution = false;
                this.type_model_detection = ""
                this.streamVideo = args.streamVideo;
                this.max_descriptor_distance = 0.7;
                this.matches = null;
                this.faceMatcher = null;
                this.url_ws_service = null;

                //validate instance
                this.validateInstance(args);
                // init websocket
                this.ws = io(this.url_ws_service)
                this._configWebSocket()

            }

            _configWebSocket() {
                this.ws.on('connect', () => {
                    console.log("System connect")
                    this._execution = true;

                })
                this.ws.on('disconnect', () => {
                    console.log('System disconnected');
                    this._execution = false;
                });
                this.ws.on("connect_error", (error) => {
                    throw new Error(error)
                })
                this.ws.on("message", ws => this.on_service(ws));
            }

            /**
             * Function for return actual status of system
             * @return {Object} objeto con algunos atributos del sistema
             */
            get attributes() {

                return {
                    minimum_date_of_knowledge: this.min_date_knowledge,
                    features: this.features,
                    type_system: this.type_system,
                    execution: (this._execution) ? 'System on' : 'System off'
                };
            }

            /**
             * Validaciones
             * @param {String} type el tipo de dato necesario o argumento requerido
             * @return {Error} mensaje de error indicando el tipo erroneo o falta de variable
             *  
             */
            isRequired(type = null) {

                throw new Error(
                    (type !== null) ? `Missing parameter. Expected ${type}` : `Missing parameter`
                );
            }

            /**
             * Function for validate instance of class
             * @param {Object} args argumentos de la instancia de MvfyHsv
             * @return {Array} contiene la validacion y el valor ej: [[true,'nuevo sistema'], ...]
             *  
             */
            validateInstance(args = {}) {

                const validator = {
                    validate_url_ws_service: (url) => {
                        if (typeof(url) === 'string') {

                            return [true, url];
                        }
                        this.isRequired('url_ws_service [String]');
                        return [false];
                    },
                    validate_max_descriptor_distance: (distance) => {
                        if (typeof(distance) === "number" && (distance > 0 && distance < 1)) {
                            return [true, distance];
                        }
                        this.isRequired('max_descriptor_distance [Number] (min:0.1, max:0.9)');
                        return [false];
                    },
                    validate_min_date_knowledge: (date) => {
                        if (Array.isArray(date)) {
                            if (parseInt(date[0]) !== NaN && date[1].search(/(week|month|year)/g) >= 0) {

                                date = [date[0], date[1]];
                                return [true, date];
                            }

                        } else if (typeof(date) === 'string') {
                            date = date.match(/(^\d+)|(day|week|month|year)+/g) || MIN_DATE_KNOWLEDGE;
                            return [true, date];
                        }

                        this.isRequired('min_date_knowledge [String or Array], permissible: ["1", "month"] or "1 week"');
                        return [false];
                    },
                    validate_features: (features) => {
                        if ((typeof(features) === 'string' || Array.isArray(features)) && ALLOWED_FEATURES.includes(features)) {
                            return [true, features];
                        }
                        this.isRequired('features [String or Array], permissible [all, ageAndgender, expressions, none]');
                        return [false];
                    },
                    validate_type_system(type_system) {
                        if (typeof(type_system) === 'string' && TYPE_SYSTEM.includes(type_system)) {
                            return [true, type_system];
                        }
                        this.isRequired('type_system [String], permissible [optimized, precise]');
                        return [false];
                    }
                }

                let total_validations = {};
                let validate_args = [];
                const keys_validator = Object.keys(validator);

                keys_validator.forEach((v, i) => {
                    let name = v.split("validate_")[1];
                    let value = (args[`${name}`]) ? validator[`${v}`](args[`${name}`]) : validator[`${v}`]("");
                    total_validations[`${name}`] = value[1];
                    validate_args.push(value[0])
                });

                if (validate_args.reduce((acc, el) => acc && el)) {
                    console.log(total_validations);
                    ({
                        min_date_knowledge: this.min_date_knowledge = this.min_date_knowledge,
                        features: this.features = this.features,
                        type_system: this.type_system = this.type_system,
                        decoder: this.decoder = this.decoder,
                        url_ws_service: this.url_ws_service
                    } = {...total_validations });

                } else {
                    return new Error('Instancia no valida, verfique las caracteristicas del modelo')
                }

            }

            /**
             * Init user's webcam
             */
            startVideo() {
                let streamVideo = this.streamVideo;
                // Pedimos permiso al usuario para acceder
                navigator.getUserMedia = (navigator.getUserMedia ||
                    navigator.webKitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia);
                // capturamos el video
                navigator.getUserMedia({ video: {} },
                    stream => streamVideo.srcObject = stream,
                    err => console.log(err));
            }

            /**
             * Function for load user's label faces and their detections
             */
            labelFaceDescriptors() {
                if (this.matches) {
                    const labeledFaceDescriptors =
                        this.matches.map(match => {

                            if (match.descriptor != null && match.label != null) {
                                return new faceapi.LabeledFaceDescriptors(match.label, [new Float32Array(match.descriptor)]);
                            }

                        })

                    this.faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, this.max_descriptor_distance);
                }

            };

            /**
             * Function for load models
             */
            async loadModels() {

                let url = '../models';

                try {

                    await faceapi.loadFaceRecognitionModel(url)

                    if (this.type_system == 'optimized') {
                        await faceapi.nets.tinyFaceDetector.loadFromUri(url);
                        this.type_model_detection = 'TinyFaceDetectorOptions'
                    } else {
                        await faceapi.nets.ssdMobilenetv1.loadFromUri(url);
                        this.type_model_detection = 'SsdMobilenetv1Options'
                    }

                    let array_features = (Array.isArray(this.features)) ? this.features : [this.features]

                    await faceapi.nets.faceLandmark68Net.loadFromUri(url)

                    array_features.forEach(async v => {
                        if (v == 'all') {
                            await faceapi.nets.faceExpressionNet.loadFromUri(url)
                            await faceapi.nets.ageGenderNet.loadFromUri(url)
                        } else if (v == 'ageandgender') {
                            await faceapi.nets.ageGenderNet.loadFromUri(url)
                        } else if (v == 'expressions') {
                            await faceapi.nets.faceExpressionNet.loadFromUri(url)
                        }
                    })
                } catch (error) {
                    throw new Error(`Error: ${error} `)
                }
            }

            /**
             * Function for init detection 
             */
            async initDetections() {

                let streamVideo = this.streamVideo

                streamVideo.addEventListener('play', async() => {

                    // Create a canvas object
                    const canvas = faceapi.createCanvasFromMedia(streamVideo);
                    document.body.append(canvas);

                    // assign dimensions of display images
                    const displaySize = { width: streamVideo.width, height: streamVideo.height };
                    faceapi.matchDimensions(canvas, displaySize);



                    //Interval of detections
                    setInterval(async() => {

                        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                        let detections = await this.loadDetectionsAndFeatures();

                        detections.map(detection => {
                            console.log(detection)

                            let resizedDetection = faceapi.resizeResults(detection, displaySize)
                            let uniqueName = Math.floor(Date.now() / 1000)
                            console.log(this.faceMatcher)
                            if (this.faceMatcher) {
                                const results = faceMatcher.findBestMatch(resizedDetection.descriptor)
                                const drawOptionsStranger = {}
                                if (results) {
                                    let array_features = (Array.isArray(this.features)) ? this.features : [this.features]

                                    array_features.forEach(async v => {
                                        if (v == 'all') {
                                            await faceapi.nets.faceExpressionNet.loadFromUri(url)
                                            await faceapi.nets.ageGenderNet.loadFromUri(url)
                                        } else if (v == 'ageandgender') {
                                            await faceapi.nets.ageGenderNet.loadFromUri(url)
                                        } else if (v == 'expressions') {
                                            await faceapi.nets.faceExpressionNet.loadFromUri(url)
                                        } else {

                                        }
                                    })
                                    drawOptionsStranger = {
                                        label: `gvgfgrg`,
                                        lineWidth: 2,
                                        boxColor: 'green',
                                        drawLabelOptions: { fontStyle: 'Roboto' }
                                    }
                                } else {
                                    drawOptionsStranger = {
                                        label: 'Desconocido',
                                        lineWidth: 2,
                                        boxColor: 'red',
                                        drawLabelOptions: { fontStyle: 'Roboto' }
                                    }
                                }
                                new faceapi.draw.DrawBox(resizedDetection.detection.box, drawOptionsStranger).draw(canvas)
                            }

                            // console.log(detection)
                            // const { age, gender, genderProbability } = detection
                            // const drawOptions = {
                            //     anchorPosition: 'TOP_LEFT',
                            //     backgroundColor: 'rgba(0, 0, 0, 0.5)'
                            // }

                            // new faceapi.draw.DrawTextField(
                            //     [
                            //         `${faceapi.utils.round(age, 0)} años`,
                            //         `${gender} (${faceapi.utils.round(genderProbability)})`
                            //     ],
                            //     detection.detection.box.topRight,
                            //     drawOptions
                            // ).draw(canvas)

                        })

                    }, 5000);
                })
            }

            /**
             * Function for detect faces
             */
            loadDetectionsAndFeatures() {
                let streamVideo = this.streamVideo;

                if (streamVideo !== null) {
                    let detections = faceapi.detectAllFaces(streamVideo, new faceapi[`${this.type_model_detection}`]()).withFaceLandmarks().withFaceDescriptors()

                    let array_features = (Array.isArray(this.features)) ? this.features : [this.features]

                    array_features.forEach(v => {
                        if (v == 'all') {
                            detections = detections.withAgeAndGender().withFaceExpressions()
                        } else if (v == 'ageandgender') {
                            detections = detections.withAgeAndGender()
                        } else if (v == 'expressions') {
                            detections = detections.withFaceExpressions()
                        }
                    })

                    return detections

                } else {
                    console.error('Atribute streamVideo not found')
                }

            }

            async start() {
                this.startVideo();
                this.insertInstance();
                await this.loadModels();
                await this.initDetections();
                await this.labelFaceDescriptors();
            }

            on_service(data) {
                console.log(data)
                let json = JSON.parse(data);
                if (typeof json.data !== "undefined" && json.data != null) {
                    console.log(json)
                    switch (json.action) {
                        case REQUEST.GET_INITIALIZED_SYSTEM:
                            this.initialize(json.data)
                            break;
                        case REQUEST.ERROR:
                            console.error(`${json.error}`)
                            break;
                    }

                }

            }

            initialize(data) {
                if (data.error != null) {
                    throw new Error(`Error found in initialized system ${data.error}`)
                } else {
                    let { id, matches } = data
                    if (id == null || matches == null) {
                        throw new Error(`Expected values id and matches`)
                    }
                    this.id = id
                    this.matches = matches
                }
            }

            setDetection(data) {
                this.ws.send(JSON.stringify({
                    action: ACTIONS.SET_DETECTION,
                    data: {
                        id: this.id,
                        _label: data.label,
                        _description: data.label
                    }
                }))
            }

            insertInstance() {
                this.ws.send(JSON.stringify({
                    action: ACTIONS.INIT_SYSTEM,
                    data: {
                        id: this.id,
                        min_date_knowledge: this.min_date_knowledge,
                        features: this.features,
                        type_system: this.type_system,
                        max_descriptor_distance: this.max_descriptor_distance
                    }
                }))
            }

            saveMatch() {
                this.ws.send(JSON.stringify({
                    action: ACTIONS.INIT_SYSTEM,
                    data: {
                        id: this.id,
                        min_date_knowledge: this.min_date_knowledge,
                        features: this.features,
                        type_system: this.type_system,
                        max_descriptor_distance: this.max_descriptor_distance
                    }
                }))
            }
        }

        return MvfyHsv
    }

})));