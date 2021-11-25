"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateUser = exports.getUser = exports.getUsers = exports.addUser = exports.deleteSystem = exports.getSystem = exports.updateSystem = exports.addSystem = undefined;

var _entities = require("../../entities");

var _index = require("../data-access/index");

var _addSystem = require("./system/add-system");

var _addSystem2 = _interopRequireDefault(_addSystem);

var _updateSystem = require("./system/update-system");

var _updateSystem2 = _interopRequireDefault(_updateSystem);

var _deleteSystem = require("./system/delete-system");

var _deleteSystem2 = _interopRequireDefault(_deleteSystem);

var _getSystem = require("./system/get-system");

var _getSystem2 = _interopRequireDefault(_getSystem);

var _addUser = require("./user/add-user");

var _addUser2 = _interopRequireDefault(_addUser);

var _getUsers = require("./user/get-users");

var _getUsers2 = _interopRequireDefault(_getUsers);

var _updateUser = require("./user/update-user");

var _updateUser2 = _interopRequireDefault(_updateUser);

var _getUser = require("./user/get-user");

var _getUser2 = _interopRequireDefault(_getUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// System

//user


// same layer
//system
// entities
const addSystem = (0, _addSystem2.default)({ systemsDB: _index.systemsDB, makeSystem: _entities.makeSystem });
// data access

const updateSystem = (0, _updateSystem2.default)({ systemsDB: _index.systemsDB, makeSystem: _entities.makeSystem });
const deleteSystem = (0, _deleteSystem2.default)({ systemsDB: _index.systemsDB });
const getSystem = (0, _getSystem2.default)({ systemsDB: _index.systemsDB });

// User
const addUser = (0, _addUser2.default)({ UserDB: _index.UserDB, makeUser: _entities.makeUser });
const getUsers = (0, _getUsers2.default)({ UserDB: _index.UserDB });
const getUser = (0, _getUser2.default)({ usersDB });
const updateUser = (0, _updateUser2.default)({ usersDB, makeUser: _entities.makeUser });

exports.addSystem = addSystem;
exports.updateSystem = updateSystem;
exports.getSystem = getSystem;
exports.deleteSystem = deleteSystem;
exports.addUser = addUser;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.updateUser = updateUser;