"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserDB = exports.SystemDB = void 0;

var _systemMongo = _interopRequireDefault(require("./mongodb/system-mongo"));

var _userMongo = _interopRequireDefault(require("./mongodb/user-mongo"));

var _mongodb = _interopRequireDefault(require("./mongodb/mongodb"));

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
const client = new _mongodb.default(properties);
const SystemDB = (0, _systemMongo.default)({
  client
});
exports.SystemDB = SystemDB;
const UserDB = (0, _userMongo.default)({
  client
});
exports.UserDB = UserDB;