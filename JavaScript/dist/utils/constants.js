"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WEEKS = exports.UNKNOWS_URL = exports.TYPE_SYSTEM = exports.TYPE_SERVICE = exports.REQUEST = exports.PORT = exports.MONTHS = exports.MODELS_URL = exports.HTML_STREAMER = exports.DAYS = exports.DATE_FORMAT = exports.CONFIG_URL = exports.ALLOWED_FEATURES = exports.ACTION = exports.ACQUAINTANCES_URL = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UNKNOWS_URL = _path.default.join(__dirname, '/../unknows_url');

exports.UNKNOWS_URL = UNKNOWS_URL;

const ACQUAINTANCES_URL = _path.default.join(__dirname, '/../acquaintances_url');

exports.ACQUAINTANCES_URL = ACQUAINTANCES_URL;

const MODELS_URL = _path.default.join(__dirname, '/mvfy/models');

exports.MODELS_URL = MODELS_URL;

const CONFIG_URL = _path.default.join(__dirname, '/../config');

exports.CONFIG_URL = CONFIG_URL;
const PORT = process.env.PORT || 3000; //static

exports.PORT = PORT;
const HTML_STREAMER = {
  URL: _path.default.join(__dirname, '/../public/streamer.html'),
  PORT_REPLACE: '<<<PORT>>>',
  DOMAIN_REPLACE: '<<<DOMAIN>>>',
  EMIT_REPLACE: '<<<EMIT>>>'
}; //system

exports.HTML_STREAMER = HTML_STREAMER;
const ALLOWED_FEATURES = {
  ALL: "all",
  AGE_AND_GENDER: "ageandgender",
  EXPRESSIONS: "expressions"
};
exports.ALLOWED_FEATURES = ALLOWED_FEATURES;
const TYPE_SYSTEM = {
  OPTIMIZED: "optimized",
  PRECISE: "precise"
};
exports.TYPE_SYSTEM = TYPE_SYSTEM;
const TYPE_SERVICE = {
  REMOTE: "remote",
  LOCAL: "local"
};
exports.TYPE_SERVICE = TYPE_SERVICE;
const ACTION = {
  INIT_SYSTEM: "INIT_SYSTEM",
  SET_DETECTION: "SET_DETECTION"
};
exports.ACTION = ACTION;
const REQUEST = {
  ERROR: "ERROR",
  GET_MODEL_FEATURES: "GET_MODEL_FEATURES",
  GET_INITIALIZED_SYSTEM: "GET_INITIALIZED_SYSTEM",
  SEND_DETECTION_VALIDATED: "SEND_DETECTION_VALIDATED",
  LOCAL_IMAGE_SEND: "LOCAL_IMAGE_SEND"
}; //time

exports.REQUEST = REQUEST;
const DATE_FORMAT = "DD/MM/YYYY";
exports.DATE_FORMAT = DATE_FORMAT;

const DAYS = quantity => {
  quantity = Number(quantity);

  if (typeof quantity == 'number') {
    return Array(quantity, "days");
  } else {
    throw new TypeError("type of the quantity days is invalid");
  }
};

exports.DAYS = DAYS;

const WEEKS = quantity => {
  quantity = Number(quantity);

  if (typeof quantity == 'number') {
    return Array(quantity, "weeks");
  } else {
    throw new TypeError("type of the quantity weeks is invalid");
  }
};

exports.WEEKS = WEEKS;

const MONTHS = quantity => {
  quantity = Number(quantity);

  if (typeof quantity == 'number') {
    return Array(quantity, "months");
  } else {
    throw new TypeError("type of the quantity months is invalid");
  }
};

exports.MONTHS = MONTHS;