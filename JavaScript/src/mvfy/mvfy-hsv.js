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

import '@tensorflow/tfjs-node';
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import * as utils from '../utils'
import path from 'path';
import fs from 'file-system'
import stringify from 'fast-json-stable-stringify'
import { StringDecoder } from 'string_decoder'
import SocketIO from 'socket.io'

//constants
import {
    MODELS_URL,
    CONFIG_URL,
    MIN_DATE_KNOWLEDGE,
    ALLOWED_FEATURES,
    TYPE_SYSTEM,
    REQUEST
} from "../utils/constants"

import {
    addSystem,
    getSystem,
    getUsers
} from '../use-cases/index'


export default class MvfyHsv {

    /**
     * Constructor principal del modelo
     * @params {String} name nombre personalizado del sistema
     * @param {String} name_file nombre del archivo donde se guardaran las detecciones
     */
    constructor(args = {}) {

        let { server, options } = args

        if (server == null || options == null) {
            throw new Error("server u options argument is required")
        }

        this.min_date_knowledge = MIN_DATE_KNOWLEDGE
        this.features = ALLOWED_FEATURES[0]
        this.type_system = TYPE_SYSTEM[0]
        this.type_model_detection = ""
        this.decoder = 'utf-8'
        this.max_descriptor_distance = 0.7
        this.execution = false;
        this.io = SocketIO(server, options)

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
     * Validations of instance
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
     * Load models and initialize video
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


        return new faceapi.FaceMatcher(labeledFaceDescriptors, this.max_descriptor_distance);

    };

    /**
     * Function for init the system
     * @param {Object} data 
     */
    async initSystem(data) {
        try {
            let system = null
            let { id, ...all_data } = data
            if (id == null) {
                system = await addSystem(all_data)
            } else {
                let _system = await getSystem({
                    id
                });
                system = (_system == null) ? await addSystem(all_data) : _system
            }

            let matches = getUsers({
                query: {
                    idSystem: id
                }
            })

            matches = (matches != null) ? matches : []

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

    /**
     * Evaluate detection of face user
     * @param {Object} user 
     */
    async evaluate_detection(user) {
        let detection = this.bd.update(collection.USERS, {
            _id: new ObjectId(user._id)
        }, {
            history: utils.convertString2Int(user.history) + 1
        })
        console.log("detection insert", detection)
    }

    /**
     * Evaluate new detection
     * @param {Object} data 
     */
    async setDetection(data) {
        let ObjectId = enviroment.mongodb.ObjectId
        try {
            if (data.id != null && data.label != null) {
                let exist_user = await this.bd.findOne(collection.USERS, {
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

    /**
     * websocket - connection
     */
    connect() {
        this.io.on('connection', (ws) => this.ws(ws))
    }

    /**
     * Websocket - initizalize receiver 
     * @param {SocketIO} socket 
     */
    ws(socket) {
        console.log("websocket connect")
        socket.on("message", (json) => this.receiver(json))
    }

    /**
     * Websocket - manage receiver
     * @param {String} json 
     */
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