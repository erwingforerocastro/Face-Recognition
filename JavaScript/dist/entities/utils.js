'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.md5 = exports.userValidator = exports.systemValidator = undefined;

var _constants = require('../utils/constants');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        validate_decoder: decoder => {
            if (typeof decoder !== 'string') {
                throw new Error('decoder must be a string');
            }
        },
        validate_maxDescriptorDistance: distance => {
            if (typeof distance !== "number" && distance < 0 && distance > 1) {
                throw new Error('maxDescriptorDistance must be a number in range 0-1');
            }
        },
        validate_minDateKnowledge: date => {
            if (typeof date !== 'string') {
                throw new Error('minDateKnowledge must be a string');
            }
        },
        validate_minFrequency: frecuency => {
            if (typeof frecuency !== 'number' || frecuency < 0 || frecuency > 1) {
                throw new Error('minFrequency must be a number between 0 and 1');
            }
        },
        validate_features: features => {
            if (typeof features !== 'string' && !Array.isArray(features) || !Object.values(_constants.ALLOWED_FEATURES).includes(features)) {
                throw new Error(`features must be a [String or Array], permissible: ${Object.values(_constants.ALLOWED_FEATURES).join(" or ")}`);
            }
        },
        validate_typeSystem: type_system => {
            if (typeof type_system === 'string' && Object.values(_constants.TYPE_SYSTEM).includes(type_system)) {
                throw new Error(`typeSystem must be a string, permissible: ${Object.values(_constants.TYPE_SYSTEM).join(" or ")}`);
            }
        },
        validate_typeService: type_service => {
            if (typeof features !== 'string' && !Object.values(_constants.TYPE_SERVICE).includes(type_service)) {
                throw new Error(`type_service must be a string, permissible: ${Object.values(_constants.TYPE_SERVICE).join(" or ")}`);
            }
        }
    });

    const keys_validator = Object.keys(validator);

    keys_validator.forEach(v => {
        let name = v.split("validate_")[1];
        validator[`${v}`](args[`${name}`]);
    });
}

/**Falta terminar */
function userValidator(args = {}) {
    const validator = Object.freeze({
        validate_decoder: decoder => {
            if (typeof decoder !== 'string') {
                throw new Error('decoder must be a string');
            }
        },
        validate_maxDescriptorDistance: distance => {
            if (typeof distance !== "number" && distance < 0 && distance > 1) {
                throw new Error('maxDescriptorDistance must be a number in range 0-1');
            }
        },
        validate_minDateKnowledge: date => {
            if (typeof date !== 'string') {
                throw new Error('minDateKnowledge must be a string');
            }
        },
        validate_features: features => {
            if (typeof features !== 'string' && !Array.isArray(features) || !Object.values(_constants.ALLOWED_FEATURES).includes(features)) {
                throw new Error(`features must be a [String or Array], permissible: ${Object.values(_constants.ALLOWED_FEATURES).join(" or ")}`);
            }
        },
        validate_typeSystem: type_system => {
            if (typeof type_system === 'string' && Object.values(_constants.TYPE_SYSTEM).includes(type_system)) {
                throw new Error(`typeSystem must be a string, permissible: ${Object.values(_constants.TYPE_SYSTEM).join(" or ")}`);
            }
        },
        validate_typeService: type_service => {
            if (typeof features !== 'string' && !Object.values(_constants.TYPE_SERVICE).includes(type_service)) {
                throw new Error(`type_service must be a string, permissible: ${Object.values(_constants.TYPE_SERVICE).join(" or ")}`);
            }
        }
    });

    const keys_validator = Object.keys(validator);

    keys_validator.forEach(v => {
        let name = v.split("validate_")[1];
        validator[`${v}`](args[`${name}`]);
    });
}

/**
 * Encoding text to md5 algorit
 * @param {String} text 
 * @returns encoding 
 */
function md5(text) {
    return _crypto2.default.createHash('md5').update(text, 'utf-8').digest('hex');
}

exports.systemValidator = systemValidator;
exports.userValidator = userValidator;
exports.md5 = md5;