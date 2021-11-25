'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _constants = require('./constants');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_moment2.default.locale('es');

/**
 * Function convert <String> to <Int>
 * @param {String} string 
 * @returns {Number} 
 */
const convertString2Int = string => {
    let sub_string = string.match(/\d+/gi);
    return sub_string ? parseInt(sub_string.join("")) : 0;
};

/**
 * ecuation of percentaje 
 * @param {Number} total total value
 * @param {Number} percentaje percentaje [0 to 1]
 * @param {Number} value value to extract 
 * @param {Boolean} invert invert ecuation
 * @returns Number - result of ecuation
 */
const frecuency = (total, percentaje, value, invert = false) => {
    return invert ? value * total / percentaje : value * percentaje / total;
};

/**
 * Function for obtain actual date
 * @param {String} _format - valid format see https://momentjs.com/docs/#/parsing/string-format/
 * @return {String}
 */
const getActualDate = (_format = _constants.DATE_FORMAT) => {
    return (0, _moment2.default)().format(format);
};

/**
 * Function for get diference between a date and now
 * @param {String} _date - date
 * @param {String} _type default {days} - valid type see {link}
 * @return {Number} 
 */
const getDateDiffSoFar = (_date, _type = "days", invert = false) => {
    let date = typeof _date == "string" ? (0, _moment2.default)(_date).format(_constants.DATE_FORMAT) : _date;
    let date_now = getActualDate();
    if (date) {
        return invert ? date_now.diff(date, _type) : date.diff(date_now, _type);
    } else {
        throw new TypeError(`getDateDiffSoFar - Invalid date ${_date}`);
    }
};

/**
 * Replace keys in text
 * @param {String} text 
 * @param {Array[String]} keys values to be replaced
 * @param {Array[String]} values values 
 * @return text replaced 
 */
const replaceValues = (text, keys, values) => {
    let tempText = text;
    if (keys.length !== values.length) {
        throw new Error("keys and values has not same length");
    }
    keys.map((v, i) => {
        tempText.replace(keys[i], values[i]);
    });

    return tempText;
};

exports.default = {
    convertString2Int,
    frecuency,
    replaceValues,
    getActualDate,
    getDateDiffSoFar

};