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
    constructor(properties = {}) {

        if (properties.url) {
            this.mongoUrl = properties.url
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
    async _connect(options = { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 10 }) {
        try {
            let url = this.mongoUrl
            this._db = await MongoClient.connect(url, options)
            return this._db.db()
        } catch (e) {
            return e
        }
    }

    /**
     * Get actual connection
     * @returns {MongoClient.db}
     */
    async getConnection() {
        try {
            if (this.db == null) {
                this.db = await this._connect()
                console.log('Connected', this.mongoUrl)
            }
            return this.db
        } catch (e) {
            return e
        }
    }

    async insert(collection, query) {
        const connection = await this.getConnection()
        return await connection.collection(collection).insertOne(query).catch(err => {
            if (err) throw err
        })
    }

    async update(collection, query, newvalues) {
        const connection = await this.getConnection()
        return await connection.collection(collection).update(query, newvalues).catch(err => {
            if (err) throw err
        })
    }

    async find(collection, query = {}, parameters = {}) {
        const connection = await this.getConnection()
        return await connection.collection(collection).find(query, parameters);
    }

    async findOne(collection, query = {}, parameters = {}) {
        const connection = await this.getConnection()
        return await connection.collection(collection).findOne(query, parameters).catch(err => {
            if (err) throw err
        })
    }
    async deleteOne(collection, query = {}) {
        const connection = await this.getConnection()
        return await connection.collection(collection).deleteOne(query).catch(err => {
            if (err) throw err
        })
    }
    async deleteMany(collection, query = {}) {
        const connection = await this.getConnection()
        return await connection.collection(collection).deleteMany(query).catch(err => {
            if (err) throw err
        })
    }
}