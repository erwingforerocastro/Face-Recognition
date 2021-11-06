import {
    DATE_FORMAT
} from './constants'
import moment from 'moment'
moment.locale('es')

/**
 * Function convert <String> to <Int>
 * @param {String} string 
 * @returns {Number} 
 */
const convertString2Int = (string) => {
    let sub_string = string.match(/\d+/gi)
    return (sub_string) ? parseInt(sub_string.join("")) : 0
}

/**
 * ecuation of percentaje 
 * @param {Number} total total value
 * @param {Number} percentaje percentaje [0 to 1]
 * @param {Number} value value to extract 
 * @param {Boolean} invert invert ecuation
 * @returns Number - result of ecuation
 */
const frecuency = (total, percentaje, value, invert = false) => {
    return invert ? (value * total) / percentaje : (value * percentaje) / total
}

/**
 * Function for obtain actual date
 * @param {String} _format - valid format see https://momentjs.com/docs/#/parsing/string-format/
 * @return {String}
 */
const getActualDate = (_format = DATE_FORMAT) => {
    return moment().format(format)
}

/**
 * Function for get diference between a date and now
 * @param {String} _date - date
 * @param {String} _type default {days} - valid type see {link}
 * @return {Number} 
 */
const getDateDiffSoFar = (_date, _type = "days", invert = false) => {
    let date = typeof(_date) == "string" ? moment(_date).format(DATE_FORMAT) : _date
    let date_now = getActualDate()
    if (date) {
        return invert ? date_now.diff(date, _type) : date.diff(date_now, _type)
    } else {
        throw new TypeError(`getDateDiffSoFar - Invalid date ${_date}`)
    }
}

export default {
    convertString2Int,
    frecuency,
    getActualDate,
    getDateDiffSoFar

}