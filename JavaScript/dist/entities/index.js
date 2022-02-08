"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeUser = exports.makeSystem = void 0;

var _Id = _interopRequireDefault(require("../Id"));

var _user = _interopRequireDefault(require("./user/user"));

var _system = _interopRequireDefault(require("./system/system"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const makeUser = (0, _user.default)({
  Id: _Id.default
});
exports.makeUser = makeUser;
const makeSystem = (0, _system.default)({
  "Id": _Id.default,
  "validator": _utils.systemValidator,
  "md5": _utils.md5
});
exports.makeSystem = makeSystem;