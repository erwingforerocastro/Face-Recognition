import * as mongo from 'mongodb'

const MongoClient = mongo.MongoClient;

(async() => {
    let mongoUrl = `mongodb://${MONGO_CONFIG.MONGO_USERNAME}:${MONGO_CONFIG.MONGO_PASSWORD}@${MONGO_CONFIG.MONGO_HOSTNAME}:${MONGO_CONFIG.MONGO_PORT}/${MONGO_CONFIG.MONGO_DB}`;
    console.log(mongoUrl);
    let db = null

    /**
     * connect bd
     * @returns {MongoClient.db}
     */
    let _connect = async() => {
        try {
            let url = mongoUrl
            let _db = await MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 10 })
            db = _db
            return _db.db()
        } catch (e) {
            return e
        }
    }

    /**
     * Get actual connection
     * @returns {MongoClient.db}
     */
    let getConnection = async() => {
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
})()