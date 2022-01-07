"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MakeGetSystem;

function MakeGetSystem({
  systemsDB
}) {
  return async function getSystem(systemInfo) {
    const system = makeSystem(systemInfo);
    return systemsDB.findByHash({
      hash: system.getHash()
    });
  };
}