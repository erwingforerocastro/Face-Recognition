/**
 * Configuration for the database
 */
const MongoClient = require('mongodb').MongoClient
const env = require('../config/db.config')

// const mongoUrl = `mongodb://${env.MONGO_HOSTNAME}:${env.MONGO_PORT}/${env.MONGO_DB}`;
const mongoUrl = `mongodb+srv://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${env.MONGO_HOSTNAME}/${env.MONGO_DB}?retryWrites=true&w=majority`
let db = null

const _connect = async() => {
    try {
        let url = mongoUrl
        let _db = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 10 })
        db = _db
        return _db.db()
    } catch (e) {
        return e
    }
}

const getConnection = async() => {
    try {
        if (db == null) {
            db = await _connect()
            console.log('Connected', db)
        }
        return db
    } catch (e) {
        return e
    }
}

module.exports = getConnection()