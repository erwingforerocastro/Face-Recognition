"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeGetUsers;

function makeGetUsers({
  usersDB
}) {
  return async function getUsers({
    query,
    parameters = {}
  } = {}) {
    return usersDB.findAll({
      query,
      parameters
    });
  };
}