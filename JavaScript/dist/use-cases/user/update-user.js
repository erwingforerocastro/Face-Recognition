'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = makeUpdateUser;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function makeUpdateUser({ usersDB, makeUser }) {
    return (() => {
        var _ref = _asyncToGenerator(function* (_ref2 = {}) {
            let { id } = _ref2,
                changes = _objectWithoutProperties(_ref2, ['id']);

            if (!id) {
                throw new Error('You must supply an id.');
            }

            const user = makeUser(_extends({ id }, changes));

            return usersDB.update({
                id: id,
                system_id: user.getSystemId(),
                author: user.getAuthor(),
                detection: user.getDetection(),
                properties: user.getProperties(),
                init_date: user.getInitDate(),
                last_date: user.getLastDate(),
                knowledge: user.getKnowledge(),
                frequency: user.getFrequency(),
                author: user.getAuthor(),
                created_on: user.getCreatedOn(),
                modified_on: user.getModifiedOn(),
                id: user.getId()
            });
        });

        function updateUser() {
            return _ref.apply(this, arguments);
        }

        return updateUser;
    })();
}