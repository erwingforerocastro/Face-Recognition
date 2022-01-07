"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeUserDB;

var _Id = _interopRequireDefault(require("../../Id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeUserDB({
  client
}) {
  const collection = "users";
  const db = client;
  return Object.freeze({
    findAll,
    findById,
    findOne,
    insert,
    remove,
    update
  });

  async function findAll({
    query,
    parameters
  }) {
    const result = await db.find(collection, query, parameters);

    if (result == null || result.length == 0) {
      return null;
    }

    return result.toArray().map(({
      _id: id,
      ...found
    }) => ({
      id,
      ...found
    }));
  }

  async function findById({
    id: _id
  }) {
    const found = await db.find(collection, {
      _id
    });

    if (found.length === 0) {
      return null;
    }

    const {
      _id: id,
      ...info
    } = found[0];
    return {
      id,
      ...info
    };
  }

  async function findOne({
    query,
    parameters
  }) {
    const found = await db.findOne(collection, query, parameters);

    if (found) {
      return null;
    }

    const {
      _id: id,
      ...info
    } = found;
    return {
      id,
      ...info
    };
  }

  async function insert({
    id: _id = _Id.default.makeId(),
    ...systemInfo
  }) {
    const result = await db.insert(collection, {
      _id,
      ...systemInfo
    });
    const {
      _id: id,
      ...insertedInfo
    } = result.ops[0];
    return {
      id,
      ...insertedInfo
    };
  }

  async function update({
    id: _id,
    ...systemInfo
  }) {
    await db.update(collection, {
      _id
    }, {
      $set: { ...systemInfo
      }
    });
    return {
      id: _id,
      ...systemInfo
    };
  }

  async function remove({
    id: _id
  }) {
    const result = await db.deleteOne({
      _id
    });
    return result.deletedCount;
  }
}