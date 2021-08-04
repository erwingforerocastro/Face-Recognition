(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (global = global || self, factory(global.MvfyHsv = global.MvfyHsv || {}));
}(this, (function(exports) {

    'use strict';

    /**  
     * @license
     * MvFy HSV: Modulo de seguridad visual
     *
     * Copyright©Erwing Fc ~ erwingforerocastro@gmail.com All Rights Reserved.
     *
     *
     * Date: 2020-09-04
     */

    var environment;

    function isBrowser() {
        return typeof window === 'object' &&
            typeof document !== 'undefined' &&
            typeof HTMLImageElement !== 'undefined' &&
            typeof HTMLCanvasElement !== 'undefined' &&
            typeof HTMLVideoElement !== 'undefined' &&
            typeof ImageData !== 'undefined' &&
            typeof CanvasRenderingContext2D !== 'undefined';
    }

    function isNodejs() {
        return typeof global === 'object' &&
            typeof require === 'function' &&
            typeof module !== 'undefined'
            // issues with gatsby.js: module.exports is undefined
            // && !!module.exports
            &&
            typeof process !== 'undefined' && !!process.version;
    }

    function getEnv() {
        if (!environment) {
            throw new Error('getEnv - environment is not defined, check isNodejs() and isBrowser()');
        }
        return environment;
    }

    function setEnv(env) {
        environment = env;
    }

    function initialize() {
        // check for isBrowser() first to prevent electron renderer process
        // to be initialized with wrong environment due to isNodejs() returning true
        if (isBrowser()) {
            setEnv(createBrowserEnv());
        }
        if (isNodejs()) {
            setEnv(createNodejsEnv());
        }
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
        moment.locale('es');
        // const { CONFIG_URL, MODELS_URL, UNKNOWS_URL, ACQUAINTANCES_URL } = require('../utils/constants')
        const { convertString2Int } = require('./utils')

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
            constants: require('../utils/constants'),
            convertString2Int: convertString2Int
        }
    }

    function createBrowserEnv() {}


    const ALLOWED_FEATURES = ['all', 'ageandgender', 'expressions', 'none'];
    const MIN_DATE_KNOWLEDGE = ['1', 'week'];
    const TYPE_SYSTEM = ['optimized', 'precise'];
    const KEY_ARGUMENTS = ['min_date_knowledge', 'file_extension', 'features', 'type_system']
    const VALID_TYPE_DATE = ["day", "week", "month", "year"]

    const ACTIONS = {
        INIT_SYSTEM: "INIT_SYSTEM",
        SET_DETECTION: "SET_DETECTION",
    }
    const REQUEST = {
        ERROR: "ERROR",
        GET_MODEL_FEATURES: "GET_MODEL_FEATURES",
        GET_INITIALIZED_SYSTEM: "GET_INITIALIZED_SYSTEM"
    }

    const collections = {
        SYSTEMS: "systems",
        USERS: "users"
    }

    class MvfyHsv {

        // "use strict";

        /**
         * Constructor principal del modelo
         * @param {String} name nombre personalizado del sistema
         * @param {String} name_file nombre del archivo donde se guardaran las detecciones
         */
        constructor(args = {}) {

            if (!environment) {
                initialize();
            }

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
                let ObjectId = mongodb.ObjectId
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
        async setDetection(data) {
            let ObjectId = mongodb.ObjectId
            try {
                if (data.id != null && data.label != null) {
                    let exist_user = await this.bd.findOne(collections.USERS, {
                        label: data.label,
                        system_id: data.id
                    })

                    if (exist_user) {
                        let actual_history = convertString2Int(exist_user.history) + 1
                        let detection = this.bd.update(collections.USERS, {
                            _id: new ObjectId(exist_user._id)
                        }, {
                            history: convertString2Int(exist_user.history) + 1
                        })
                        console.log("detection insert", detection)
                    } else {
                        await this.bd.insert(collection.USERS, {
                            system_id: data.id,
                            label: data.label,
                            gener: data.gener,
                            age: data.age,
                            history: 0,
                            knowledge: false,
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

})));