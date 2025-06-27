import express from 'express';
import path from 'path';
import {mkdir, readFile, writeFile} from 'fs/promises';
import {signupAccountSchema, loginAccountSchema} from './schemas/accounts.js';

const port = 8080;
const app = express();
app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({status: 'error', message: 'invalid JSON payload'});
  }
  next(err);
  return res.status(500).json({status: 'error', message: 'internal server error'});
});

const filepath = path.resolve('./db/accounts.json');
const rootPassword = 'root';
let accounts = [];

(async function initializeData() {
  try {
    const data = await readFile(filepath, 'utf-8');
    accounts = JSON.parse(data) ?? [];
  } catch {
    console.warn('accounts.json not found or is invalid, initializing new dataset');
    accounts = [];

    await mkdir(path.dirname(filepath), {recursive: true});
    await writeFile(filepath, JSON.stringify(accounts, null, 2));
  }
})();

async function saveAccounts(data) {
  try {
    const path = filepath;
    await writeFile(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Failed to write to ${path}`, err);
  }
}

app.get('/accounts', (req, res) => {
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
  const usernameExists = accounts.find((item) => item.username === account.username);
  const phoneExists = accounts.find((item) => item.phone === account.phone);
  const emailExists = accounts.find((item) => item.email === account.email);

  if (error) {
    return res.status(400).json({status: 'error', message: error.details[0].message});
  }
  if (usernameExists) {
    return res.status(400).json({status: 'error', message: 'username is already taken'});
  }
  if (phoneExists) {
    return res.status(400).json({status: 'error', message: 'phone is already taken'});
  }
  if (emailExists) {
    return res.status(400).json({status: 'error', message: 'email is already taken'});
  }

  accounts.push(account);
  await saveAccounts(accounts);
  return res.status(201).json({status: 'ok', message: 'account has been added successfully'});
});

app.post('/login', (req, res) => {
  const {username, email, password} = req.body;
  const last_seen = new Date().toISOString();
  const loginAccount = {username, email, password, last_seen};
  const {error, account} = loginAccountSchema.validate(loginAccount);

  if (error) {
    return res.status(400).json({status: 'error', message: error.details[0].message});
  }

  const accountExists = accounts.find((u) => u.username === account.username && u.password === account.password);
  if (!accountExists) {
    return res.status(401).json({status: 'error', message: 'invalid credentials'});
  }
  return res.status(200).json();
});

app.listen(port, () => '');
