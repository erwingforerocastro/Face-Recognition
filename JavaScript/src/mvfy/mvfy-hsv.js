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

// import '@tensorflow/tfjs-node';
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
// import * as canvas from 'canvas';
import * as faceapi from './face-api.js';
import * as utils from '../utils'
import fs from 'file-system'
import stringify from 'fast-json-stable-stringify'
import { StringDecoder } from 'string_decoder'
import SocketIO from 'socket.io'
import streamer from './streamer'
import path from 'path';
//constants
import * as constants from "../utils/constants"

import {
    addSystem,
    addUser,
    getSystem,
    getUser,
    getUsers,
    updateSystem,
    updateUser
} from '../use-cases/index'

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
     * @param {String} args.title [title=null] - title of system.
     */
    constructor(args = {}) {

        let { server, options, ...otherInfo } = args
        //create or return system of bd

        this._require_create = (otherInfo.type_service == constants.TYPE_SERVICE.LOCAL)
        this.type_service = otherInfo.type_service //*required
        this.port = otherInfo.port
        this.domain = "localhost"
        this.title = Math.floor(new Date() / 1000)
        this._stream_fps = 30
        this.id = null
        this.features = null
        this.min_date_knowledge = null
        this.min_frequency = 0.7
        this.decoder = 'utf-8'
        this.max_descriptor_distance = null
        this.type_system = null
        this.execution = false
        this.type_model_detection = null

        this._insert(otherInfo)

        if (server == null || options == null) {
            throw new Error("server and options argument is required")
        }

        this.io = SocketIO(server, options)

    }

    /**
     * Change fps of stream video
     * @param {number} fps 
     */
    change_video_fps(fps) {
        if (typeof(fps) == "number") {
            this._stream_fps = fps
        } else {
            throw new Error("Invalid fps of video")
        }
    }

    /**
     * Init system in backend process
     * WARNING - this function block the event loop
     */
    start() {

        // console.log("WARNING - this function block the event loop")

        (async() => {
            try {

                console.log("Charging system..")

                if (this._require_create) {
                    let system = await this._create(this.values)
                    this._insert(system)
                }

                console.log("conecting websocket..")
                this.io.on('connection', (ws) => this.ws(ws))

                if (this.type_service == constants.TYPE_SERVICE.LOCAL) {
                    if (this.id == null) {
                        throw new Error("Required initialice system")
                    }

                    console.log("Loading models..")
                    await this.loadModels()

                    console.log("Creating streamer..")
                    streamer({
                        io: this.io,
                        interval: Math.round(1000 / this._stream_fps),
                        middleware: this.middlewareDetection(),
                    })
                }

                this.execution = true
            } catch (error) {
                console.log(error);
            }
        })();

    }

    async middlewareDetection() {

    }

    /**
     * Create system
     * @param {Object} data 
     * @return {Object} system
     */
    async _create(data) {
        let system = this.values
        const similarSystem = await getSystem(data)
        console.log("create")

        if (similarSystem != null) {
            system = similarSystem
        } else {
            system = await addSystem(data)
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
            id: this.id = this.id,
            title: this.title = this.title,
            min_date_knowledge: this.min_date_knowledge = this.min_date_knowledge,
            min_frequency: this.min_frequency = this.min_frequency,
            features: this.features = this.features,
            type_system: this.type_system = this.type_system,
            type_service: this.type_service = this.type_service,
            type_model_detection: this.type_model_detection = this.type_model_detection,
            decoder: this.decoder = this.decoder,
            max_descriptor_distance: this.max_descriptor_distance = this.max_descriptor_distance,
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
            type_service: this.type_service,
            type_model_detection: this.type_model_detection,
            decoder: this.decoder,
            max_descriptor_distance: this.max_descriptor_distance,
        };
    }

    /**
     * Function for load models
     */
    async loadModels() {

        let url = constants.MODELS_URL;

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
     * Lab
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
     * Function for init the system
     * @param {Object} data 
     */
    async initSystem(data) {
        try {
            let system = await this._create(data)
            this._insert(system)

            let matches = getUsers({
                query: {
                    system_id: system.id
                }
            })

            matches = (matches != null) ? matches : []

            this.io.send(stringify({
                action: constants.REQUEST.SEND_DETECTION_VALIDATED,
                data: {
                    system_id: system.id,
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
    async evaluateDetection(user) {
        let prevUser = user
        let diffDate = utils.getDateDiffSoFar(user.init_date, this.min_date_knowledge[1] /** type of date see MvFyHsv.const  */ )
        if (diffDate > this.min_date_knowledge[0] /**quantity of date's type */ && user.frequency >= this.frequency /**user's frequency is more bigger that system */ ) {
            user.knowledge = true
        } else if (utils.getDateDiffSoFar(user.last_date, this.min_date_knowledge[1], true) > 0) { // las date is other date's type (eje. days)
            let prevDays = utils.frequency(this.min_date_knowledge[0], 1, this.frequency, true) // previous count of date's type (eje. days)
            user.last_date = utils.getActualDate()
            user.frequency = utils.frequency(this.min_date_knowledge[0], 1, prevDays + 1) // add this date's type (eje. days)
        }

        return (prevUser !== user) ? await updateUser({
            ...user,
            modified_on: utils.getActualDate()
        }) : user

    }

    /**
     * Evaluate new detection
     * @param {Object} user 
     */
    async setDetection(user) {
        try {
            let _user = user
            if (user.id != null && user.detection != null) {
                let exist_user = await getUser({
                    query: {
                        system_id: this.id,
                        detection: user.detection
                    }
                })

                if (exist_user) {
                    _user = await this.evaluateDetection(exist_user)
                } else {
                    _user = await addUser({
                        ...user,
                        modified_on: utils.getActualDate(),
                        created_on: utils.getActualDate()
                    })
                }
            }
            this.io.send(stringify({
                action: constants.REQUEST.SEND_DETECTION_VALIDATED,
                data: {
                    user: _user
                }
            }))
        } catch (error) {
            this.io.send(stringify({
                action: constants.REQUEST.ERROR,
                data: {
                    error: `Error validation user - ${user.author} \n: ${error}`
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
        socket.on("message", async(json) => await this.receiver(json))
    }

    /**
     * Websocket - manage receiver
     * @param {String} json 
     */
    async receiver(json) {
        let data = JSON.parse(json)
        switch (data.action) {
            case ACTIONS.INIT_SYSTEM:
                await this.initSystem(data.data)
                break;
            case ACTIONS.SET_DETECTION:
                await this.setDetection(data.data)
                break;
        }
    }

    /**
     * use callback of express app for return stream video local
     * @param {Any} req 
     * @param {Any} res 
     */
    static async getStreamer(req, res) {

        let contentHtml = fs.readFileSync(constants.HTML_STREAMER.URL, 'utf-8')
        let keys = [constants.HTML_STREAMER.PROTOCOL_REPLACE, constants.HTML_STREAMER.HOST_REPLACE, constants.HTML_STREAMER.EMIT_REPLACE]
        let values = [req.protocol, `${req.get('host')}${req.originalUrl}`, constants.REQUEST.LOCAL_IMAGE_SEND]
        let newData = utils.replaceValues(contentHtml, keys, values);

        if (!fs.existsSync(path.dirname(constants.HTML_STREAMER.URL_TEMP))) {
            fs.mkdirSync(path.dirname(constants.HTML_STREAMER.URL_TEMP), {
                recursive: true
            });
        }

        fs.writeFileSync(constants.HTML_STREAMER.URL_TEMP, newData, { encoding: 'utf8' });

        res.sendFile(constants.HTML_STREAMER.URL_TEMP)
    }
}

MvfyHsv.const = Object.freeze({
    ...constants
})

export default MvfyHsv