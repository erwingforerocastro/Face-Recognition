"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = makeAddUser;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function makeAddUser({ usersDB, makeUser }) {
    return (() => {
        var _ref = _asyncToGenerator(function* (userInfo) {

            const user = makeUser(userInfo);
            return usersDB.insert({
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

        function addUser(_x) {
            return _ref.apply(this, arguments);
        }

        return addUser;
    })();
}