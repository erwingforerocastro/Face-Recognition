/**  
 * @license
 * MvFy HSV: Modulo de seguridad visual
 *
 * Copyright© Erwing Fc ~ erwingforerocastro@gmail.com All Rights Reserved.
 *
 *
 * Date: 2020-09-04
 */

import fs from 'fs'
import face_api from './face-api'
import path from 'path'

const ALLOWED_EXTENSIONS = ['json', 'csv', 'xls'];
const ALLOWED_FEATURES = ['all', 'landmarks', 'ageandgender', 'expressions', 'none'];
const MIN_DATE_KNOWLEDGE = ['1', 'week'];
const TYPE_SYSTEM = ['optimized', 'precise'];
const MAX_DESCRIPTOR = 0.7;

/**
 * Iniciar la camara web del usuario
 * @param {object HTMLElement} video_label etiqueta de video donde se muestra la información
 * @return null
 */
const startVideo = (video_label) => {
    // Pedimos permiso al usuario para acceder
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webKitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    // capturamos el video
    navigator.getUserMedia({ video: {} },
        stream => video_label.srcObject = stream,
        err => console.log(err));
}

/**
 * Cargar los modelos e iniciar video
 * @param {String} features variable con la caracteristica adicional a la predicción
 * @param {String} type_system tipo de sistema optimo o preciso
 * @return null
 */
const loadExternalModels = async(features, type_system) => {

    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('scripts/weights');

        if (type_system == 'optimized') {
            await faceapi.nets.tinyFaceDetector.loadFromUri('scripts/weights');
        } else {
            await faceapi.nets.ssdMobilenetv1.loadFromUri('scripts/weights');
        }
        array_features = (Array.isArray(features)) ? features : [features]

        array_features.forEach(v => {
            if (v == 'all') {
                await faceapi.nets.faceLandmark68Net.loadFromUri('scripts/weights')
                await faceapi.nets.faceExpressionNet.loadFromUri('scripts/weights')
                await faceapi.nets.ageGenderNet.loadFromUri('scripts/weights')
            } else if (v == 'landmarks') {
                await faceapi.nets.faceLandmark68Net.loadFromUri('scripts/weights')
            } else if (v == 'ageandgender') {
                await faceapi.nets.ageGenderNet.loadFromUri('scripts/weights')
            } else if (v == 'expressions') {
                await faceapi.nets.faceExpressionNet.loadFromUri('scripts/weights')
            }
        })
    } catch (error) {
        throw new Error(`Error: ${error} `)
    }

}

/**
 * Iniciar las configuraciones iniciales del sistema
 * @param {MvfyHsv} actualSystem intancia de la clase principal 
 * @return {FaceMatcher}
 *  
 */
const preloadSystem = async(actualSystem, folder_name = 'system') => {
    let actualPath = path.join(__dirname, `${folder_name}`);
    let actualFile = path.join(actualPath, `${actualSystem.name_file}.${actualSystem.extension}`);

    // validamos la carpeta del sistema
    if (!fs.existsSync(actualPath)) {

        fs.mkdirSync(actualPath, (err) => {
            if (err) {
                throw new Error(`Error ${err}`)
            }
        })
    }

    // validamos que el archivo exista
    if (!fs.existsSync(actualFile)) {

        fs.writeFileSync(actualFile, (err) => {
            if (err) {
                throw new Error(`Error ${err}`);
            }
        })
    }

    await loadExternalModels(actualSystem.features, actualSystem.type_system)

}

/**
 * Detectar los rostros y etiquetarlos
 * 
 * @param {String} route ruta de guardado de las imagenes
 * @param {Array} labels nombre u etiqueta de las imagenes de los usuarios
 * @return {FaceMatcher}
 *  
 */

const labelsMatchers = async(route, labels) => {

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
 * Validaciones
 * @param {String} type el tipo de dato necesario o argumento requerido
 * @return {Error} mensaje de error indicando el tipo erroneo o falta de variable
 *  
 */
const isRequired = (type = null) => {

    throw new Error(
        (type !== null) ? `Missing parameter. Expected ${type}` : `Missing parameter`
    );
}

/**
 * Validaciones de una instancia
 * @param {Object} args argumentos de la instancia de MvfyHsv
 * @return {Array} contiene la validacion y el valor ej: [true,'nuevo sistema']
 *  
 */
const validateInstance = (args = {}) => {

    const validator = {

        validate_name: (name) => {

            if (name.length > 0 && typeof(name) === 'string') {
                return [true, name];
            }

            isRequired('name [String]');
            return [true, 'hsv_system'];
        },
        validate_name_file: (file_name) => {
            if (file_name.length > 0 && typeof(file_name) === 'string') {
                return [true, file_name];
            }

            isRequired('file_name [String]');
            return [true, 'hsv_architecture']
        },
        validate_video_input: (video_input) => {
            if (video_input.toString() === '[object]') {
                return [true, video_input];
            }

            isRequired('video_input [object]');
            return [false];
        },
        validate_min_data_knowledge: (date) => {
            if (Array.isArray(date)) {
                if (parseInt(date[0]) !== NaN && date[1].search(/(week|month|year)/g) >= 0) {

                    date = [date[0], date[1]];
                    return [true, date];
                }

            } else if (typeof(date) === 'string') {
                date = date.match(/(^\d+)|(day|week|month|year)+/g) || MIN_DATE_KNOWLEDGE;
                return [true, date];
            }

            isRequired('min_date_knowledge [String or Array], permissible: ["1", "month"] or "1 week"');
            return [false];
        },
        validate_file_extension: (file_extension) => {

            if (typeof(file_extension) === 'string' && ALLOWED_EXTENSIONS.includes(file_extension)) {
                return [true, file_extension];
            }
            isRequired('file_extension [String], permissible [json, xls, csv]');
            return [false];

        },
        validate_features: (features) => {
            if ((typeof(features) === 'string' || Array.isArray(features)) && ALLOWED_FEATURES.includes(file_extension)) {
                return [true, features];
            }
            isRequired('features [String or Array], permissible [all, ageAndgender, expressions, none]');
            return [false];
        },
        validate_type_system(type_system) {
            if (typeof(type_system) === 'string' && ALLOWED_FEATURES.includes(type_system)) {
                return [true, type_system];
            }
            isRequired('type_system [String], permissible [optimized, precise]');
            return [false];
        }
    }

    const total_validations = [];

    for (let i in args) {
        total_validations.concat(validator[`validate_${i}`](args[i]))
    }

    return total_validations

}

export class MvfyHsv {

    // "use strict";

    /**
     * Constructor principal del modelo
     * @param {String} name nombre personalizado del sistema
     * @param {String} name_file nombre del archivo donde se guardaran las detecciones
     * @param {Object} video_input
     */
    constructor(args = {}) {

        temp_args = validateInstance(args);
        validate_args = temp_args.map((v, i) => v[i][0]);

        if (validate_args.reduce((acc, el) => acc && el)) {

            value_args = temp_args.map((v, i) => v[i][1]);

            ({
                [0]: this.name,
                [1]: this.name_file,
                [2]: this.video_input = '',
                [3]: this.min_date_knowledge = MIN_DATE_KNOWLEDGE,
                [4]: this.file_extension = ALLOWED_EXTENSIONS[0],
                [5]: this.features = ALLOWED_FEATURES[0],
                [6]: this.type_system = TYPE_SYSTEM[0]
            } = value_args);

            this.#execution = false;
            preloadSystem(this);
        }

    }

    /**
     * Funcion para retornar el estado actual del sistema
     * @return {Object} objeto con algunos atributos del sistema
     */
    get attributes() {

        return {
            name_system: this.name,
            name_file: this.name_file,
            label_of_video: this.video_label,
            minimum_date_of_knowledge: this.min_date_knowledge,
            execution: (this.execution) ? 'System on' : 'System off'
        };
    }

    load(args = {}) {
        if (!this.#execution) {
            preloadSystem({ state } = args, this);
        } else {
            throw new Error('the system is on');
        }

    }

    async get_detections(args = {}) {

        if (this.#execution) {

        } else {
            throw new Error('the system is off');
        }


    }

    async run() {
        this.#execution = true;
        await loadExternalModels(this.features);


    }

    async pause() {

    }

    async end() {

    }
}