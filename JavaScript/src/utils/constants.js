import path from 'path';


export const UNKNOWS_URL = path.join(__dirname, '/../unknows_url');
export const ACQUAINTANCES_URL = path.join(__dirname, '/../acquaintances_url');
export const MODELS_URL = path.join(__dirname, '/../models');
export const CONFIG_URL = path.join(__dirname, '/../config');
export const MATCH_FILE = path.join(CONFIG_URL, `match_faces.json`);
export const CONFIG_FILE = path.join(CONFIG_URL, 'config.json');
export const PORT = process.env.PORT || 3000;