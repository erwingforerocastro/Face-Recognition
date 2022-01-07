"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeDeleteSystem;

function makeDeleteSystem({
  systemsDB
}) {
  return async function deleteSystem({
    id,
    ...otherInfo
  } = {}) {
    if (!id) {
      throw new Error('You must supply an id.');
    }

    return systemsDB.delete({
      id: id,
      ...otherInfo
    });
  };
}