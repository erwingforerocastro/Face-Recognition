/**  
 * @license
 * MvFy HSV: Modulo de seguridad visual
 *
 * Copyright©Erwing Fc ~ erwingforerocastro@gmail.com All Rights Reserved.
 *
 *
 * Date: 2020-09-04
 */


import fs from 'fs'
import face_api from './face-api'
import path from 'path'
import { parse } from 'fast-json-parser'
import { stringify } from 'fast-json-stable-stringify'
import { CONFIG_URL, MODELS_URL, UNKNOWS_URL, ACQUAINTANCES_URL, MATCH_FILE, CONFIG_FILE } from './constants'

const ALLOWED_FEATURES = ['all', 'ageandgender', 'expressions', 'none'];
const MIN_DATE_KNOWLEDGE = ['1', 'week'];
const TYPE_SYSTEM = ['optimized', 'precise'];
const KEY_ARGUMENTS = ['min_date_knowledge', 'file_extension', 'features', 'type_system']


/**
 * Cargar los modelos e iniciar video
 * @param {String} features variable con la caracteristica adicional a la predicción
 * @param {String} type_system tipo de sistema optimo o preciso
 */
const loadExternalModels = async(features, type_system) => {
    const url = MODELS_URL;

    try {

        await faceapi.loadFaceRecognitionModel(url)

        if (type_system == 'optimized') {
            await faceapi.nets.tinyFaceDetector.loadFromUri(url);
        } else {
            await faceapi.nets.ssdMobilenetv1.loadFromUri(url);
        }

        array_features = (Array.isArray(features)) ? features : [features]

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
 * Iniciar las configuraciones iniciales del sistema
 * @param { MvfyHsv } actualSystem intancia de la clase principal 
 * @return {FaceMatcher}
 *  
 */
const preloadSystem = async(actualSystem) => {



    // validamos que el archivo exista
    if (!fs.existsSync(MATCH_FILE)) {

        fs.writeFileSync(MATCH_FILE, stringify({}), (err) => {
            if (err) {
                throw new Error(`Error ${err}`);
            }
        })
    }

    let data = stringify(actualSystem)

    //validamos el archivo de rostros
    if (!fs.existsSync(CONFIG_FILE)) {

        fs.writeFileSync(CONFIG_FILE, data, (err) => {
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
 * @return {Array} contiene la validacion y el valor ej: [[true,'nuevo sistema'], ...]
 *  
 */
const validateInstance = (args = {}) => {

    const validator = {

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

    const total_validations = [];
    const keys_validator = Object.keys(validator);

    keys_validator.forEach((v, i) => {
        let name = v.split("validate_")[1];
        let value = (args[`${name}`]) ? validator[`${v}`](args[`${name}`]) : validator[`${v}`]("");
        total_validations.push(value)
    });


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

        const temp_args = validateInstance(args);
        const validate_args = temp_args.map((v) => v[0]);

        if (validate_args.reduce((acc, el) => acc && el)) {
            const value_args = {};
            temp_args.map((v, i) => {
                value_args[`${KEY_ARGUMENTS[i]}`] = v[1]
            });


            ({
                min_date_knowledge: this.min_date_knowledge = MIN_DATE_KNOWLEDGE,
                features: this.features = ALLOWED_FEATURES[0],
                type_system: this.type_system = TYPE_SYSTEM[0]
            } = value_args);

            this._execution = false;
            preloadSystem(value_args);
        } else {
            return new Error('Instancia no valida, verfique las caracteristicas del modelo')
        }

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

    load(args = {}) {
        if (!this._execution) {
            preloadSystem({ state } = args, this);
        } else {
            throw new Error('the system is on');
        }

    }

    async get_detections(args = {}) {

        if (this._execution) {

        } else {
            throw new Error('the system is off');
        }


    }

    async run() {
        this._execution = true;
        await loadExternalModels(this.features);


    }

    async pause() {

    }

    async end() {

    }
}