'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserDB = exports.SystemDB = undefined;

var _systemMongo = require('./mongodb/system-mongo');

var _systemMongo2 = _interopRequireDefault(_systemMongo);

var _userMongo = require('./mongodb/user-mongo');

var _userMongo2 = _interopRequireDefault(_userMongo);

var _mongodb = require('./mongodb/mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const env = process.env;

const properties = {
    url: env.MVFY_MONGOURL || "",
    MONGO_USERNAME: env.MVFY_MONGO_USERNAME || "",
    MONGO_PASSWORD: env.MVFY_MONGO_PASSWORD || "",
    MONGO_HOSTNAME: env.MVFY_MONGO_HOSTNAME || "",
    MONGO_PORT: env.MVFY_MONGO_PORT || "",
    MONGO_DB: env.MVFY_MONGO_DB || ""
};

const client = new _mongodb2.default(properties);

const SystemDB = (0, _systemMongo2.default)({ client });
const UserDB = (0, _userMongo2.default)({ client });

exports.SystemDB = SystemDB;
exports.UserDB = UserDB;