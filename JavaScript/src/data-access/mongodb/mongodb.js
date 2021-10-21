import * as mongo from 'mongodb'

const MongoClient = mongo.MongoClient;

export default class MongoDB {
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
    constructor({
        url,
        ...properties
    } = {}) {

        if (url) {
            this.mongoUrl = url
        } else {
            ({
                MONGO_USERNAME: this.MONGO_USERNAME = "root",
                MONGO_PASSWORD: this.MONGO_PASSWORD = "",
                MONGO_HOSTNAME: this.MONGO_HOSTNAME,
                MONGO_PORT: this.MONGO_PORT,
                MONGO_DB: this.MONGO_DB,

            } = properties)

            this.mongoUrl = `mongodb://${this.MONGO_USERNAME}:${this.MONGO_PASSWORD}@${this.MONGO_HOSTNAME}:${this.MONGO_PORT}/${this.MONGO_DB}`;
        }

        this.db = null
    }

    /**
     * connect bd
     * @param {Object} options default { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 10 }
     * @returns {MongoClient.db}
     */
    _connect = async(options = { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 10 }) => {
        try {
            let url = this.mongoUrl
            this._db = await MongoClient.connect(url, options)
            db = this._db
            return _db.db()
        } catch (e) {
            return e
        }
    }

    /**
     * Get actual connection
     * @returns {MongoClient.db}
     */
    getConnection = async() => {
        try {
            if (this.db == null) {
                this.db = await _connect()
                console.log('Connected', this.db)
            }
            return this.db
        } catch (e) {
            return e
        }
    }

    insert = async(collection, query) => {
        const connection = await this.getConnection()
        return await connection.collection(collection).insertOne(query).catch(err => {
            if (err) throw err
        })
    }

    update = async(collection, query, newvalues) => {
        const connection = await this.getConnection()
        return await connection.collection(collection).update(query, newvalues).catch(err => {
            if (err) throw err
        })
    }

    find = async(collection, query = {}, parameters = {}) => {
        const connection = await this.getConnection()
        return await connection.collection(collection).find(query, parameters);
    }

    findOne = async(collection, query = {}, parameters = {}) => {
        const connection = await this.getConnection()
        return new Promise((resolve) => {
            connection.collection(collection).findOne(query, parameters, (err, result) => {
                if (err) throw err;
                resolve(result);
            });
        })
    }
    deleteOne = async(collection, query = {}) => {
        const connection = await this.getConnection()
        return await connection.collection(collection).deleteOne(query).catch(err => {
            if (err) throw err
        })
    }
    deleteMany = async(collection, query = {}) => {
        const connection = await this.getConnection()
        return await connection.collection(collection).deleteMany(query).catch(err => {
            if (err) throw err
        })
    }
}