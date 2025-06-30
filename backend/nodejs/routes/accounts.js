import express from 'express';
import {createAccounts, getAccounts, signupAccount, signinAccount, deleteAccount} from '../controllers/accounts.js';
await createAccounts();

const router = express.Router();

router.get('/all', getAccounts);
router.post('/signup', signupAccount);
router.post('/signin', signinAccount);
router.delete('/delete', deleteAccount);

export default router;
