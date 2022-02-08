"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.systemsDB = exports.UserDB = void 0;

var _systemMongo = _interopRequireDefault(require("./mongodb/system-mongo"));

var _userMongo = _interopRequireDefault(require("./mongodb/user-mongo"));

var _mongodb = _interopRequireDefault(require("./mongodb/mongodb"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var properties = {
  url: _config.default.url,
  MONGO_USERNAME: _config.default.MONGO_USERNAME,
  MONGO_PASSWORD: _config.default.MONGO_PASSWORD,
  MONGO_HOSTNAME: _config.default.MONGO_HOSTNAME,
  MONGO_PORT: _config.default.MONGO_PORT,
  MONGO_DB: _config.default.MONGO_DB
};
const client = new _mongodb.default(properties);
const systemsDB = (0, _systemMongo.default)({
  client
});
exports.systemsDB = systemsDB;
const UserDB = (0, _userMongo.default)({
  client
});
exports.UserDB = UserDB;