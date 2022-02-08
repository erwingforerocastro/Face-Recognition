"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var mongo = _interopRequireWildcard(require("mongodb"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const MongoClient = mongo.MongoClient;

class MongoDB {
  /**
   * 
   * @param {Object} {
   * url (optional),
   * MONGO_USERNAME default "root",
     MONGO_PASSWORD default "",
     MONGO_HOSTNAME,
     MONGO_PORT,
     MONGO_DB,
   * }
   */
  constructor(properties = {}) {
    if (properties.url) {
      this.mongoUrl = properties.url;
    } else {
      ({
        MONGO_USERNAME: this.MONGO_USERNAME = "root",
        MONGO_PASSWORD: this.MONGO_PASSWORD = "",
        MONGO_HOSTNAME: this.MONGO_HOSTNAME,
        MONGO_PORT: this.MONGO_PORT,
        MONGO_DB: this.MONGO_DB
      } = properties);
      this.mongoUrl = `mongodb://${this.MONGO_USERNAME}:${this.MONGO_PASSWORD}@${this.MONGO_HOSTNAME}:${this.MONGO_PORT}/${this.MONGO_DB}`;
    }

    this.db = null;
  }
  /**
   * connect bd
   * @param {Object} options default { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 10 }
   * @returns {MongoClient.db}
   */


  async _connect(options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 10
  }) {
    try {
      let url = this.mongoUrl;
      this._db = await MongoClient.connect(url, options);
      return this._db.db();
    } catch (e) {
      return e;
    }
  }
  /**
   * Get actual connection
   * @returns {MongoClient.db}
   */


  async getConnection() {
    try {
      if (this.db == null) {
        this.db = await this._connect();
        console.log('Connected', this.mongoUrl);
      }

      return this.db;
    } catch (e) {
      return e;
    }
  }

  async insert(collection, query) {
    const connection = await this.getConnection();
    return await connection.collection(collection).insertOne(query).catch(err => {
      if (err) throw err;
    });
  }

  async update(collection, query, newvalues) {
    const connection = await this.getConnection();
    return await connection.collection(collection).update(query, newvalues).catch(err => {
      if (err) throw err;
    });
  }

  async find(collection, query = {}, parameters = {}) {
    const connection = await this.getConnection();
    return await connection.collection(collection).find(query, parameters);
  }

  async findOne(collection, query = {}, parameters = {}) {
    const connection = await this.getConnection();
    return await connection.collection(collection).findOne(query, parameters).catch(err => {
      if (err) throw err;
    });
  }

  async deleteOne(collection, query = {}) {
    const connection = await this.getConnection();
    return await connection.collection(collection).deleteOne(query).catch(err => {
      if (err) throw err;
    });
  }

  async deleteMany(collection, query = {}) {
    const connection = await this.getConnection();
    return await connection.collection(collection).deleteMany(query).catch(err => {
      if (err) throw err;
    });
  }

}

exports.default = MongoDB;