import { ALLOWED_FEATURES, TYPE_SYSTEM } from '../utils/constants'

/**
 * Function to validate values of system
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
                throw new Error('distance must be a number in range 0-1')
            }
        },
        validate_min_date_knowledge: (date) => {
            if (typeof(date) !== 'string') {
                throw new Error('min_date_knowledge must be a string')
            }
        },
        validate_features: (features) => {
            if ((typeof(features) !== 'string' && !Array.isArray(features)) || !ALLOWED_FEATURES.includes(features)) {
                throw new Error('features must be a [String or Array], permissible [all, ageAndgender, expressions, none]')
            }
        },
        validate_type_system(type_system) {
            if (typeof(type_system) === 'string' && TYPE_SYSTEM.includes(type_system)) {
                throw new Error('type_system must be a string, permissible [optimized, precise]')
            }
        }
    })

    const keys_validator = Object.keys(validator);

    keys_validator.forEach(v => {
        let name = v.split("validate_")[1];
        validator[`${v}`](args[`${name}`]);
    });
}
export {
    systemValidator
}