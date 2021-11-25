"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = makeGetUser;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function makeGetUser({ usersDB }) {
    return (() => {
        var _ref = _asyncToGenerator(function* ({ query, parameters = {} }) {
            return usersDB.findOne({ query, parameters });
        });

        function getUser(_x) {
            return _ref.apply(this, arguments);
        }

        return getUser;
    })();
}