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
        validate_maxDescriptorDistance: (distance) => {
            if (typeof(distance) !== "number" && (distance < 0 && distance > 1)) {
                throw new Error('maxDescriptorDistance must be a number in range 0-1')
            }
        },
        validate_minDateKnowledge: (date) => {
            if (typeof(date) !== 'string') {
                throw new Error('minDateKnowledge must be a string')
            }
        },
        validate_features: (features) => {
            if ((typeof(features) !== 'string' && !Array.isArray(features)) || !Object.values(ALLOWED_FEATURES).includes(features)) {
                throw new Error(`features must be a [String or Array], permissible: ${Object.values(ALLOWED_FEATURES).join(" or ")}`)
            }
        },
        validate_typeSystem: (type_system) => {
            if (typeof(type_system) === 'string' && Object.values(TYPE_SYSTEM).includes(type_system)) {
                throw new Error(`typeSystem must be a string, permissible: ${Object.values(TYPE_SYSTEM).join(" or ")}`)
            }
        },
        validate_typeService: (type_service) => {
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

function md5(text) {
    return crypto
        .createHash('md5')
        .update(text, 'utf-8')
        .digest('hex')
}

export {
    systemValidator,
    md5
}