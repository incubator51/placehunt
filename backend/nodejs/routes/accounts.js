import express from 'express';
import {createAccounts, getAccounts, signupAccount, loginAccount, deleteAccount} from '../controllers/accounts.js';
await createAccounts();

const router = express.Router();

router.get('/all', getAccounts);
router.post('/signup', signupAccount);
router.post('/login', loginAccount);
router.delete('/delete', deleteAccount);

export default router;
