import {pool} from '../db/setup.js';
import {generatePasswordHash, checkPasswordHash} from '../db/crypto.js';
import {signupAccountSchema, loginAccountSchema, deleteAccountSchema} from '../schemas/accounts.js';
import {sendResponse} from '../utils/utils.js';

const rootPassword = process.env.DB_PASSWORD;

export const createAccounts = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS accounts (
  id SERIAL PRIMARY KEY,
  username VARCHAR(32) UNIQUE NOT NULL,
  gender VARCHAR(16) NOT NULL CHECK (gender IN ('male','female','non-binary')),
  email VARCHAR(254) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  birth_date DATE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
};

export const getAccounts = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM accounts`);
    return sendResponse(res, 200, true, 'get accounts request successful', result.rows);
  } catch (err) {
    console.error('Get accounts failed:', err);
    return sendResponse(res, 500, false, 'database error');
  }
};

export const signupAccount = async (req, res) => {
  const {error, value: account} = signupAccountSchema.validate(req.body);
  if (error) return sendResponse(res, 400, false, error.details[0].message);

  const {username, gender, phone, email, birth_date, password} = account;
  try {
    const checks = await pool.query(`SELECT username,phone,email FROM accounts WHERE username=$1 OR phone=$2 OR email=$3`, [username, phone, email]);

    const duplicates = checks.rows;
    if (duplicates.some((row) => row.username === username)) return sendResponse(res, 409, false, 'username is already taken');
    if (duplicates.some((row) => row.email === email)) return sendResponse(res, 409, false, 'email is already taken');
    if (duplicates.some((row) => row.phone === phone)) return sendResponse(res, 409, false, 'phone is already taken');

    await pool.query(`INSERT INTO accounts (username, gender, email, phone, birth_date, password) VALUES ($1, $2, $3, $4, $5, $6)`, [
      username,
      gender,
      email,
      phone,
      birth_date,
      await generatePasswordHash(password),
    ]);
    return sendResponse(res, 201, true, 'account has been added successfully');
  } catch (err) {
    console.error('Signup failed:', err);
    return sendResponse(res, 500, false, 'database error');
  }
};

export const loginAccount = async (req, res) => {
  const {error, value: account} = loginAccountSchema.validate(req.body);
  if (error) return sendResponse(res, 400, false, error.details[0].message);

  try {
    const result = await pool.query(`SELECT * from accounts where username=$1 OR email=$2`, [account.username, account.email]);

    const user = result.rows[0];
    if (!user) return sendResponse(res, 404, false, 'account not found');

    const isValidPassword = await checkPasswordHash(account.password, user.password);
    if (!isValidPassword) return sendResponse(res, 401, false, 'invalid credentials');

    await pool.query(`UPDATE accounts SET last_seen=NOW() WHERE id=$1`, [user.id]);
    return sendResponse(res, 200, true, 'login was successful');
  } catch (err) {
    console.error('Login failed:', err);
    return sendResponse(res, 500, false, 'database error');
  }
};

export const deleteAccount = async (req, res) => {
  const {error, value: account} = deleteAccountSchema.validate(req.body);
  if (error) return sendResponse(res, 400, false, error.details[0].message);

  try {
    const result = await pool.query(`SELECT * from accounts where username=$1 OR email=$2`, [account.username, account.email]);

    const accountExists = result.rows[0];
    if (!accountExists) return sendResponse(res, 404, false, 'account not found');

    const isUserPasswordValid = await checkPasswordHash(account.password, accountExists.password);
    const isRootPasswordValid = account.password === rootPassword;

    if (!isUserPasswordValid && !isRootPasswordValid) {
      return sendResponse(res, 401, false, 'invalid credentials');
    }

    await pool.query(`DELETE FROM accounts WHERE username=$1 OR email=$2`, [account.username, account.email]);
    return sendResponse(res, 204);
  } catch (err) {
    console.error('Delete failed:', err);
    return sendResponse(res, 500, false, 'database error');
  }
};
