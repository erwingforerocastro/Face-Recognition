'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeSystem = exports.makeUser = undefined;

var _Id = require('../Id');

var _Id2 = _interopRequireDefault(_Id);

var _user = require('./user/user');

var _user2 = _interopRequireDefault(_user);

var _system = require('./system/system');

var _system2 = _interopRequireDefault(_system);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const makeUser = (0, _user2.default)({ Id: _Id2.default });
const makeSystem = (0, _system2.default)({ Id: _Id2.default, systemValidator: _utils.systemValidator, md5: _utils.md5 });
exports.makeUser = makeUser;
exports.makeSystem = makeSystem;