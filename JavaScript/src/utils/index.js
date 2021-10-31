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
const getDateDiffSoFar = (_date, _type = "days") => {
    let date = environment.moment(_date)
    let date_now = this.getActualDate()
    if (date) {
        return date.diff(date_now, _type)
    } else {
        throw new TypeError(`getDateDiffSoFar - Invalid date ${_date}`)
    }
}

export default {
    convertString2Int,
    getActualDate,
    getDateDiffSoFar

}