import dotenv from 'dotenv';
dotenv.config();

const env = process.env
export default Object.freeze({
    url: env.MVFY_MONGOURL || "",
    MONGO_USERNAME: env.MVFY_MONGO_USERNAME || "",
    MONGO_PASSWORD: env.MVFY_MONGO_PASSWORD || "",
    MONGO_HOSTNAME: env.MVFY_MONGO_HOSTNAME || "",
    MONGO_PORT: env.MVFY_MONGO_PORT || "",
    MONGO_DB: env.MVFY_MONGO_DB || "",
})