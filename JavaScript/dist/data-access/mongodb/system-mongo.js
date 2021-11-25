"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = makeSystemDB;

var _Id = require("../../Id");

var _Id2 = _interopRequireDefault(_Id);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function makeSystemDB({ client }) {
    let findAll = (() => {
        var _ref = _asyncToGenerator(function* ({ query, parameters }) {
            const result = yield db.find(collection, query, parameters);
            return result.toArray().map(function (_ref2) {
                let { _id: id } = _ref2,
                    found = _objectWithoutProperties(_ref2, ["_id"]);

                return _extends({
                    id
                }, found);
            });
        });

        return function findAll(_x) {
            return _ref.apply(this, arguments);
        };
    })();

    let findById = (() => {
        var _ref3 = _asyncToGenerator(function* ({ id: _id }) {
            const found = yield db.find(collection, { _id });
            if (found.length === 0) {
                return null;
            }
            const _found$ = found[0],
                  { _id: id } = _found$,
                  info = _objectWithoutProperties(_found$, ["_id"]);
            return _extends({ id }, info);
        });

        return function findById(_x2) {
            return _ref3.apply(this, arguments);
        };
    })();

    let findByHash = (() => {
        var _ref4 = _asyncToGenerator(function* ({ hash }) {
            const found = yield db.findOne(collection, { hash });
            if (found == null) {
                return null;
            }
            const { _id: id } = found,
                  info = _objectWithoutProperties(found, ["_id"]);
            return _extends({ id }, info);
        });

        return function findByHash(_x3) {
            return _ref4.apply(this, arguments);
        };
    })();

    let insert = (() => {
        var _ref5 = _asyncToGenerator(function* (_ref6) {
            let { id: _id = _Id2.default.makeId() } = _ref6,
                systemInfo = _objectWithoutProperties(_ref6, ["id"]);

            const result = yield db.find(collection, _extends({ _id }, systemInfo));
            const _result$ops$ = result.ops[0],
                  { _id: id } = _result$ops$,
                  insertedInfo = _objectWithoutProperties(_result$ops$, ["_id"]);
            return _extends({ id }, insertedInfo);
        });

        return function insert(_x4) {
            return _ref5.apply(this, arguments);
        };
    })();

    let update = (() => {
        var _ref7 = _asyncToGenerator(function* (_ref8) {
            let { id: _id } = _ref8,
                systemInfo = _objectWithoutProperties(_ref8, ["id"]);

            yield db.update(collection, { _id }, { $set: _extends({}, systemInfo) });
            return _extends({ id: _id }, systemInfo);
        });

        return function update(_x5) {
            return _ref7.apply(this, arguments);
        };
    })();

    let remove = (() => {
        var _ref9 = _asyncToGenerator(function* ({ id: _id }) {
            const result = yield db.deleteOne({ _id });
            return result.deletedCount;
        });

        return function remove(_x6) {
            return _ref9.apply(this, arguments);
        };
    })();

    const collection = "systems";
    const db = client;

    return Object.freeze({
        findAll,
        findById,
        findByHash,
        insert,
        remove,
        update
    });
}