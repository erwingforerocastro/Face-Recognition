import makeSystemDB from './mongodb/system-mongo'
import makeUserDB from './mongodb/user-mongo'
import MongoDB from './mongodb/mongodb'


const env = process.env

const properties = {
    url: env.MVFY_MONGOURL || "",
    MONGO_USERNAME: env.MVFY_MONGO_USERNAME || "",
    MONGO_PASSWORD: env.MVFY_MONGO_PASSWORD || "",
    MONGO_HOSTNAME: env.MVFY_MONGO_HOSTNAME || "",
    MONGO_PORT: env.MVFY_MONGO_PORT || "",
    MONGO_DB: env.MVFY_MONGO_DB || "",
}

const client = new MongoDB(properties)

const SystemDB = makeSystemDB({ client })
const UserDB = makeUserDB({ client })

export {
    SystemDB,
    UserDB
}