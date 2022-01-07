"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeGetUser;

function makeGetUser({
  usersDB
}) {
  return async function getUser({
    query,
    parameters = {}
  }) {
    return usersDB.findOne({
      query,
      parameters
    });
  };
}