import path from 'path'


const UNKNOWS_URL = path.join(__dirname, '/../unknows_url');
const ACQUAINTANCES_URL = path.join(__dirname, '/../acquaintances_url');
const MODELS_URL = path.join(__dirname, '/mvfy/models');
const CONFIG_URL = path.join(__dirname, '/../config');
const PORT = process.env.PORT || 3000;
const DATE_FORMAT = "DD/MM/YYYY"
const ALLOWED_FEATURES = ['all', 'ageandgender', 'expressions', 'none'];
const MIN_DATE_KNOWLEDGE = ['1', 'week'];
const TYPE_SYSTEM = ['optimized', 'precise'];
const KEY_ARGUMENT = ['min_date_knowledge', 'file_extension', 'features', 'type_system'];
const VALID_TYPE_DATE = ["day", "week", "month", "year"];
const MONGO_CONFIG = {
    MONGO_USERNAME: '',
    MONGO_PASSWORD: '',
    MONGO_HOSTNAME: 'localhost',
    MONGO_PORT: '27017',
    MONGO_DB: 'mvfy_hsv',
}
const ACTION = {
    INIT_SYSTEM: "INIT_SYSTEM",
    SET_DETECTION: "SET_DETECTION",
};
const REQUEST = {
    ERROR: "ERROR",
    GET_MODEL_FEATURES: "GET_MODEL_FEATURES",
    GET_INITIALIZED_SYSTEM: "GET_INITIALIZED_SYSTEM"
};
const collection = {
    SYSTEMS: "systems",
    USERS: "users"
};

export {
    UNKNOWS_URL,
    ACQUAINTANCES_URL,
    MODELS_URL,
    CONFIG_URL,
    PORT,
    DATE_FORMAT,
    ALLOWED_FEATURES
}