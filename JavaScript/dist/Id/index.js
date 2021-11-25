'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cuid = require('cuid');

var _cuid2 = _interopRequireDefault(_cuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Id = Object.freeze({
  makeId: _cuid2.default,
  isValidId: _cuid2.default.isCuid
});

exports.default = Id;