import pkg from 'pg';
import {configDotenv} from 'dotenv';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
configDotenv({path: resolve(dirname(fileURLToPath(import.meta.url)), '../../../shared/.env')});

const {Pool} = pkg;
const proc = process.env;

export const pool = new Pool({
  user: proc.DB_USER,
  host: proc.DB_HOST,
  database: proc.DB_NAME,
  password: proc.DB_PASSWORD,
  port: proc.DB_PORT,
});
