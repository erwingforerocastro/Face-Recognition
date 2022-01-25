import makeSystemDB from './mongodb/system-mongo'
import makeUserDB from './mongodb/user-mongo'
import MongoDB from './mongodb/mongodb'
import config from '../config'

var properties = {
    url: config.url,
    MONGO_USERNAME: config.MONGO_USERNAME,
    MONGO_PASSWORD: config.MONGO_PASSWORD,
    MONGO_HOSTNAME: config.MONGO_HOSTNAME,
    MONGO_PORT: config.MONGO_PORT,
    MONGO_DB: config.MONGO_DB,
}

const client = new MongoDB(properties)
const systemsDB = makeSystemDB({ client })
const UserDB = makeUserDB({ client })

export {
    systemsDB,
    UserDB
}