import express from 'express';
import {configDotenv} from 'dotenv';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import {signupAccountSchema, loginAccountSchema} from './schemas/accounts.js';
import {pool} from './db/setup.js';

const app = express();
const port = process.env.SERVER_PORT;
const rootPassword = process.env.DB_PASSWORD;

configDotenv({path: resolve(dirname(fileURLToPath(import.meta.url)), '../../shared/.env')});
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({status: 'error', message: 'invalid JSON payload'});
  }
  next(err);
  return res.status(500).json({status: 'error', message: 'internal server error'});
});

app.get('/accounts', async (req, res) => {
  const password = req.query.password;

  if (password !== rootPassword) {
    return res.status(401).json({status: 'error', message: 'invalid credentials'});
  }
  return res.status(200).json(accounts);
});

app.post('/signup', async (req, res) => {
  const {username, phone, email, birth_date, password} = req.body;
  const created = new Date().toISOString();
  const last_seen = created;
  const newAccount = {username, email, phone, birth_date, password, created, last_seen};

  const {error, value: account} = signupAccountSchema.validate(newAccount);

  if (error) {
    return res.status(400).json({status: 'error', message: error.details[0].message});
  }

  try {
    const checks = await pool.query(`SELECT username,phone,email FROM accounts WHERE username=$1 OR phone=$2 OR email=$3`, [account.username, account.phone, account.email]);
    const duplicates = checks.rows;

    if (duplicates.some((row) => row.username === account.username)) {
      return res.status(400).json({status: 'error', message: 'username is already taken'});
    }
    if (duplicates.some((row) => row.phone === account.phone)) {
      return res.status(400).json({status: 'error', message: 'phone is already taken'});
    }
    if (duplicates.some((row) => row.email === account.email)) {
      return res.status(400).json({status: 'error', message: 'email is already taken'});
    }

    await pool.query(`INSERT INTO accounts (username,email,phone,birth_date,password,created,last_seen) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [
      username,
      email,
      phone,
      birth_date,
      password,
      created,
      last_seen,
    ]);
    return res.status(201).json({status: 'ok', message: 'account has been added successfully'});
  } catch (err) {
    console.error('signup failed :', err);
    return res.status(500).json({status: 'error', message: 'database error'});
  }
});

app.put('/login', async (req, res) => {
  const {username, email, password} = req.body;
  const last_seen = new Date().toISOString();
  const loginAccount = {username, email, password, last_seen};
  const {error, value: account} = loginAccountSchema.validate(loginAccount);

  if (error) {
    return res.status(400).json({status: 'error', message: error.details[0].message});
  }
  try {
    const result = await pool.query(`SELECT * FROM accounts WHERE (username=$1 OR email=$2) AND password=$3`, [account.username, account.email, account.password]);
    const accountExists = result.rows[0];

    if (!accountExists) {
      return res.status(401).json({status: 'error', message: 'invalid credentials'});
    }

    await pool.query(`UPDATE accounts SET last_seen=$1 WHERE id=$2`, [account.last_seen, accountExists.id]);
    return res.status(200).json({status: 'ok', message: 'login was successful'});
  } catch (err) {
    console.error('Login failed:', err);
    return res.status(500).json({status: 'error', message: 'database error'});
  }
});

app.listen(port, () => '');
