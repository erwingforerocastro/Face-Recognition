"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = makeAddSystem;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function makeAddSystem({ systemsDB, makeSystem }) {
    return (() => {
        var _ref = _asyncToGenerator(function* (systemInfo) {

            const system = makeSystem(systemInfo);
            return systemsDB.insertOne({
                decoder: system.getDecoder(),
                type_service: system.getTypeService(),
                max_descriptor_distance: system.geMaxDescriptorDistance(),
                min_date_knowledge: system.getMinDateKnowledge(),
                min_frequency: system.getMinFrecuency(),
                features: system.getFeatures(),
                type_system: system.getTypeSystem(),
                hash: system.getHash(),
                created_on: system.getCreateOn(),
                modified_on: system.getModifiedOn()
            });
        });

        function addSystem(_x) {
            return _ref.apply(this, arguments);
        }

        return addSystem;
    })();
}