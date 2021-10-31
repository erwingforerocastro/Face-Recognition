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
import * as constants from "../utils/constants"

import {
    addSystem,
    getSystems,
    getUsers,
    updateSystem
} from '../use-cases/index'

class MvfyHsv {

    /**
     * Main model builder
     * @constructor
     * @param {Object} args
     * @param {*} args.server - Backend server for the websocket. 
     * @param {Object} args.options - options for the websocket.
     * @param {String} args.type_service - type of the listen server.
     * @param {Array} args.min_date_knowledge [min_date_knowledge=null] - minimum interval to determine a known user.
     * @param {String} args.features [features=null] - characteristics that will be saved in each detection.
     * @param {String} args.decoder [decoder='utf-8'] - data decoder.
     * @param {String} args.max_descriptor_distance [max_descriptor_distance=null] - max distance of diference between detections.
     * @param {String} args.type_system [type_system=null] - type of system.
     */
    constructor(args = {}) {

        let { server, options, ...otherInfo } = args
        //create or return system of bd
        let system = (otherInfo.type_service == constants.TYPE_SERVICE.LOCAL) ? this._create(otherInfo) : otherInfo;
        ({
            type_service: this.type_service, // *required
            id: this.id = null,
            min_date_knowledge: this.min_date_knowledge = null,
            features: this.features = null,
            decoder: this.decoder = 'utf-8',
            max_descriptor_distance: this.max_descriptor_distance = null,
            type_system: this.type_system = null,
        } = system)

        this.execution = false
        this.type_model_detection = null

        if (server == null || options == null) {
            throw new Error("server and options argument is required")
        }

        this.io = SocketIO(server, options)

    }

    /**
     * Init system in backend process
     */
    start() {
        if (this.id == null || type != "server") {
            throw new Error("Required initialize system")
        }
        this.io.on('connection', (ws) => this.ws(ws))
        this.execution = true
    }

    /**
     * Create system
     * @param {Object} data 
     * @return {Object} system
     */
    _create(data) {
        let system = {}
        const similarSystems = getSystems({
            query: {...data }
        })

        if (similarSystems) {
            system = similarSystems[0]
        } else {
            system = addSystem(data)
        }
        return system
    }

    /**
     * Update data of actual system
     * @param {Object} data Data to be update system
     */
    _update(data) {
        let { id, ...otherInfo } = this
        let system = updateSystem({
            ...data,
            id
        })
        this._insert(system)
    }

    /**
     * Insert data in actual instance of system
     * @param {Object} system Data of system
     */
    _insert(system) {
        ({
            id: this.id,
            min_date_knowledge: this.min_date_knowledge,
            features: this.features,
            type_system: this.type_system,
            type_model_detection: this.type_model_detection,
            decoder: this.decoder,
            max_descriptor_distance: this.max_descriptor_distance,
        } = system)
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
            max_descriptor_distance: this.max_descriptor_distance,
            execution: (this._execution) ? 'System on' : 'System off'
        };
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
        const url = constants.MODELS_URL;

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

            if (system) {

            } else {
                throw new Error("System not found")
            }

            let matches = getUsers({
                query: {
                    idSystem: id
                }
            })

            matches = (matches != null) ? matches : []

            this.io.send(stringify({
                action: constants.REQUEST.GET_INITIALIZED_SYSTEM,
                data: {
                    id: system._id,
                    matches: matches
                }
            }))
        } catch (error) {
            this.io.send(stringify({
                action: constants.REQUEST.ERROR,
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
                action: constants.REQUEST.ERROR,
                data: {
                    error: `Error insert detection ${error}`
                }
            }))
        }
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

MvfyHsv.const = Object.freeze({
    ...constants
})

export default MvfyHsv