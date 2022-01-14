import {
    ALLOWED_FEATURES,
    TYPE_SYSTEM,
    TYPE_SERVICE
} from '../utils/constants'
import crypto from 'crypto'

/**
 * Validate values of system
 * @params {
 * decoder, 
 * distance,
 * date,
 * features,
 * type_system
 * } 
 */
function systemValidator(args = {}) {
    const validator = Object.freeze({
        validate_decoder: (decoder) => {
            if (typeof(decoder) !== 'string') {
                throw new Error('decoder must be a string')
            }
        },
        validate_max_descriptor_distance: (distance) => {
            if (typeof(distance) !== "number" && (distance < 0 && distance > 1)) {
                throw new Error('max_descriptor_distance must be a number in range 0-1')
            }
        },
        validate_min_date_knowledge: (date) => {
            console.log(date)
            if (typeof(date) !== typeof([])) {
                throw new Error('min_date_knowledge must be a string')
            }
        },
        validate_features: (features) => {
            if ((typeof(features) !== 'string' && !Array.isArray(features)) || !Object.values(ALLOWED_FEATURES).includes(features)) {
                throw new Error(`features must be a [String or Array], permissible: ${Object.values(ALLOWED_FEATURES).join(" or ")}`)
            }
        },
        validate_type_system: (type_system) => {
            if (typeof(type_system) === 'string' && Object.values(TYPE_SYSTEM).includes(type_system)) {
                throw new Error(`type_system must be a string, permissible: ${Object.values(TYPE_SYSTEM).join(" or ")}`)
            }
        },
        validate_type_service: (type_service) => {
            if (typeof(features) !== 'string' && !Object.values(TYPE_SERVICE).includes(type_service)) {
                throw new Error(`type_service must be a string, permissible: ${Object.values(TYPE_SERVICE).join(" or ")}`)
            }

        }
    })

    const keys_validator = Object.keys(validator);

    keys_validator.forEach(v => {
        let name = v.split("validate_")[1];
        validator[`${ v }`](args[`${ name }`]);
    });
}

/**Falta terminar */
function userValidator(args = {}) {
    const validator = Object.freeze({
        validate_decoder: (decoder) => {
            if (typeof(decoder) !== 'string') {
                throw new Error('decoder must be a string')
            }
        },
        validate_max_descriptor_distance: (distance) => {
            if (typeof(distance) !== "number" && (distance < 0 && distance > 1)) {
                throw new Error('max_descriptor_distance must be a number in range 0-1')
            }
        },
        validate_min_date_knowledge: (date) => {
            if (typeof(date) !== 'string') {
                throw new Error('min_date_knowledge must be a string')
            }
        },
        validate_features: (features) => {
            if ((typeof(features) !== 'string' && !Array.isArray(features)) || !Object.values(ALLOWED_FEATURES).includes(features)) {
                throw new Error(`features must be a [String or Array], permissible: ${Object.values(ALLOWED_FEATURES).join(" or ")}`)
            }
        },
        validate_type_system: (type_system) => {
            if (typeof(type_system) === 'string' && Object.values(TYPE_SYSTEM).includes(type_system)) {
                throw new Error(`type_system must be a string, permissible: ${Object.values(TYPE_SYSTEM).join(" or ")}`)
            }
        },
        validate_type_service: (type_service) => {
            if (typeof(features) !== 'string' && !Object.values(TYPE_SERVICE).includes(type_service)) {
                throw new Error(`type_service must be a string, permissible: ${Object.values(TYPE_SERVICE).join(" or ")}`)
            }

        }
    })

    const keys_validator = Object.keys(validator);

    keys_validator.forEach(v => {
        let name = v.split("validate_")[1];
        validator[`${ v }`](args[`${ name }`]);
    });
}

/**
 * Encoding text to md5 algorit
 * @param {String} text 
 * @returns encoding 
 */
function md5(text) {
    return crypto
        .createHash('md5')
        .update(text, 'utf-8')
        .digest('hex')
}

export {
    systemValidator,
    userValidator,
    md5
}