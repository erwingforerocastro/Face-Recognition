"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongodb = require("mongodb");

var mongo = _interopRequireWildcard(_mongodb);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

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
    constructor(_ref = {}) {
        let {
            url
        } = _ref,
            properties = _objectWithoutProperties(_ref, ["url"]);

        if (url) {
            this.mongoUrl = url;
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
    _connect(options = { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 10 }) {
        var _this = this;

        return _asyncToGenerator(function* () {
            try {
                let url = _this.mongoUrl;
                _this._db = yield MongoClient.connect(url, options);
                db = _this._db;
                return _db.db();
            } catch (e) {
                return e;
            }
        })();
    }

    /**
     * Get actual connection
     * @returns {MongoClient.db}
     */
    getConnection() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            try {
                if (_this2.db == null) {
                    _this2.db = yield _connect();
                    console.log('Connected', _this2.db);
                }
                return _this2.db;
            } catch (e) {
                return e;
            }
        })();
    }

    insert(collection, query) {
        var _this3 = this;

        return _asyncToGenerator(function* () {
            const connection = yield _this3.getConnection();
            return yield connection.collection(collection).insertOne(query).catch(function (err) {
                if (err) throw err;
            });
        })();
    }

    update(collection, query, newvalues) {
        var _this4 = this;

        return _asyncToGenerator(function* () {
            const connection = yield _this4.getConnection();
            return yield connection.collection(collection).update(query, newvalues).catch(function (err) {
                if (err) throw err;
            });
        })();
    }

    find(collection, query = {}, parameters = {}) {
        var _this5 = this;

        return _asyncToGenerator(function* () {
            const connection = yield _this5.getConnection();
            return yield connection.collection(collection).find(query, parameters);
        })();
    }

    findOne(collection, query = {}, parameters = {}) {
        var _this6 = this;

        return _asyncToGenerator(function* () {
            const connection = yield _this6.getConnection();
            return new Promise(function (resolve) {
                connection.collection(collection).findOne(query, parameters, function (err, result) {
                    if (err) throw err;
                    resolve(result);
                });
            });
        })();
    }
    deleteOne(collection, query = {}) {
        var _this7 = this;

        return _asyncToGenerator(function* () {
            const connection = yield _this7.getConnection();
            return yield connection.collection(collection).deleteOne(query).catch(function (err) {
                if (err) throw err;
            });
        })();
    }
    deleteMany(collection, query = {}) {
        var _this8 = this;

        return _asyncToGenerator(function* () {
            const connection = yield _this8.getConnection();
            return yield connection.collection(collection).deleteMany(query).catch(function (err) {
                if (err) throw err;
            });
        })();
    }
}
exports.default = MongoDB;