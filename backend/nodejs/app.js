import express from 'express';
import dotenv from 'dotenv';
import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';
import accountRoutes from './routes/accounts.js';
import {sendResponse} from './utils/utils.js';

const app = express();
dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), '../../shared/.env'),
});

app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendResponse(res, 400, 'error', 'invalid JSON payload');
  }
  next(err);
  return sendResponse(res, 500, 'error', 'internal server error');
});

app.use('/accounts', accountRoutes);

export default app;
