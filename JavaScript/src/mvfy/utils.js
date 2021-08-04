const moment = require('moment');
moment.locale('es');

const convertString2Int = (string) => {
    let sub_string = string.match(/\d+/gi)
    return (sub_string) ? parseInt(sub_string.join("")) : 0
}

const getActualDate = (format = 'day') => {

}

const extractValidDate = (_date) => {
    const formats = [
        ``
    ]
}

module.exports = {
    convertString2Int
}