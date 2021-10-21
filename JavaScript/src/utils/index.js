import {
    DATE_FORMAT
} from './constants'
import moment from 'moment'
moment.locale('es')

export default Object.freeze({
    /**
     * Function convert <String> to <Int>
     * @param {String} string 
     * @returns {Number} 
     */
    convertString2Int: (string) => {
        let sub_string = string.match(/\d+/gi)
        return (sub_string) ? parseInt(sub_string.join("")) : 0
    },

    extractValidDate: (_date) => {
        const formats = [
            ``
        ]
    },

    validateTypes: (_type, _valid_types) => {

    },

    /**
     * Function for obtain actual date
     * @param {String} _format - valid format see https://momentjs.com/docs/#/parsing/string-format/
     * @return {String}
     */
    getActualDate: (_format = DATE_FORMAT) => {
        return environment.moment().format(format)
    },
    /**
     * Function for get diference between a date and now
     * @param {String} _date - date
     * @param {String} _type default {days} - valid type see {link}
     * @return {Number} 
     */
    getDateDiffSoFar: (_date, _type = "days") => {
        let date = environment.moment(_date)
        let date_now = this.getActualDate()
        if (date) {
            return date.diff(date_now, _type)
        } else {
            throw new TypeError(`getDateDiffSoFar - Invalid date ${_date}`)
        }
    }
})