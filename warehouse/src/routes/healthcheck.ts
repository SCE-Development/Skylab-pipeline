import express from 'express';
import { DatabaseConnection } from '../utils/DB'
const router = express.Router();


/* creates API endpoint to test on at localhost:8000/healthcheck */
// eslint-disable-next-line
router.get('/healthCheck', async (req: any, res: any) => {
    const DB = new DatabaseConnection();
    await DB.connect();
    const status = DB.healthCheck() ? 200 : 503;
    DB.close();
    res.sendStatus(status).send();
});

module.exports = router;
