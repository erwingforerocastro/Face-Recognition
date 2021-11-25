'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MONTHS = exports.WEEKS = exports.DAYS = exports.REQUEST = exports.ACTION = exports.HTML_STREAMER = exports.ALLOWED_FEATURES = exports.DATE_FORMAT = exports.TYPE_SERVICE = exports.TYPE_SYSTEM = exports.PORT = exports.CONFIG_URL = exports.MODELS_URL = exports.MIN_DATE_KNOWLEDGE = exports.ACQUAINTANCES_URL = exports.UNKNOWS_URL = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UNKNOWS_URL = _path2.default.join(__dirname, '/../unknows_url');
const ACQUAINTANCES_URL = _path2.default.join(__dirname, '/../acquaintances_url');
const MODELS_URL = _path2.default.join(__dirname, '/mvfy/models');
const CONFIG_URL = _path2.default.join(__dirname, '/../config');
const PORT = process.env.PORT || 3000;

//static
const HTML_STREAMER = {
    URL: _path2.default.join(__dirname, '/../public/streamer.html'),
    PORT_REPLACE: '<<<PORT>>>',
    DOMAIN_REPLACE: '<<<DOMAIN>>>',
    EMIT_REPLACE: '<<<EMIT>>>'

    //system

};const ALLOWED_FEATURES = {
    ALL: "all",
    AGE_AND_GENDER: "ageandgender",
    EXPRESSIONS: "expressions"
};
const TYPE_SYSTEM = {
    OPTIMIZED: "optimized",
    PRECISE: "precise"
};
const TYPE_SERVICE = {
    REMOTE: "remote",
    LOCAL: "local"
};
const ACTION = {
    INIT_SYSTEM: "INIT_SYSTEM",
    SET_DETECTION: "SET_DETECTION"
};
const REQUEST = {
    ERROR: "ERROR",
    GET_MODEL_FEATURES: "GET_MODEL_FEATURES",
    GET_INITIALIZED_SYSTEM: "GET_INITIALIZED_SYSTEM",
    SEND_DETECTION_VALIDATED: "SEND_DETECTION_VALIDATED",
    LOCAL_IMAGE_SEND: "LOCAL_IMAGE_SEND"
};

//time
const DATE_FORMAT = "DD/MM/YYYY";

const DAYS = quantity => {
    quantity = Number(quantity);
    if (typeof quantity == 'number') {
        return Array(quantity, "days");
    } else {
        throw new TypeError("type of the quantity days is invalid");
    }
};
const WEEKS = quantity => {
    quantity = Number(quantity);
    if (typeof quantity == 'number') {
        return Array(quantity, "weeks");
    } else {
        throw new TypeError("type of the quantity weeks is invalid");
    }
};

const MONTHS = quantity => {
    quantity = Number(quantity);
    if (typeof quantity == 'number') {
        return Array(quantity, "months");
    } else {
        throw new TypeError("type of the quantity months is invalid");
    }
};
exports.UNKNOWS_URL = UNKNOWS_URL;
exports.ACQUAINTANCES_URL = ACQUAINTANCES_URL;
exports.MIN_DATE_KNOWLEDGE = MIN_DATE_KNOWLEDGE;
exports.MODELS_URL = MODELS_URL;
exports.CONFIG_URL = CONFIG_URL;
exports.PORT = PORT;
exports.TYPE_SYSTEM = TYPE_SYSTEM;
exports.TYPE_SERVICE = TYPE_SERVICE;
exports.DATE_FORMAT = DATE_FORMAT;
exports.ALLOWED_FEATURES = ALLOWED_FEATURES;
exports.HTML_STREAMER = HTML_STREAMER;
exports.ACTION = ACTION;
exports.REQUEST = REQUEST;
exports.DAYS = DAYS;
exports.WEEKS = WEEKS;
exports.MONTHS = MONTHS;