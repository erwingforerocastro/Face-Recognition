"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.updateSystem = exports.getUsers = exports.getUser = exports.getSystem = exports.deleteSystem = exports.addUser = exports.addSystem = void 0;

var _entities = require("../../entities");

var _index = require("../data-access/index");

var _addSystem = _interopRequireDefault(require("./system/add-system"));

var _updateSystem = _interopRequireDefault(require("./system/update-system"));

var _deleteSystem = _interopRequireDefault(require("./system/delete-system"));

var _getSystem = _interopRequireDefault(require("./system/get-system"));

var _addUser = _interopRequireDefault(require("./user/add-user"));

var _getUsers = _interopRequireDefault(require("./user/get-users"));

var _updateUser = _interopRequireDefault(require("./user/update-user"));

var _getUser = _interopRequireDefault(require("./user/get-user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// entities
// data access
// same layer
//system
//user
// System
const addSystem = (0, _addSystem.default)({
  systemsDB: _index.systemsDB,
  makeSystem: _entities.makeSystem
});
exports.addSystem = addSystem;
const updateSystem = (0, _updateSystem.default)({
  systemsDB: _index.systemsDB,
  makeSystem: _entities.makeSystem
});
exports.updateSystem = updateSystem;
const deleteSystem = (0, _deleteSystem.default)({
  systemsDB: _index.systemsDB
});
exports.deleteSystem = deleteSystem;
const getSystem = (0, _getSystem.default)({
  systemsDB: _index.systemsDB
}); // User

exports.getSystem = getSystem;
const addUser = (0, _addUser.default)({
  UserDB: _index.UserDB,
  makeUser: _entities.makeUser
});
exports.addUser = addUser;
const getUsers = (0, _getUsers.default)({
  UserDB: _index.UserDB
});
exports.getUsers = getUsers;
const getUser = (0, _getUser.default)({
  usersDB
});
exports.getUser = getUser;
const updateUser = (0, _updateUser.default)({
  usersDB,
  makeUser: _entities.makeUser
});
exports.updateUser = updateUser;