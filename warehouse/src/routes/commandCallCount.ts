import express from 'express';
import { Request, Response } from 'express';

import { DatabaseConnection } from '../utils/DB';

const router = express.Router();

router.get('/commandCallCount', async (req: Request, res: Response) => {
    if (req.query.command == undefined) {
        return res.status(400).send('Command not found!');
    }

    let command: string = req.query.command as string;

    if (command == null) {
        return res.status(400).send('Command not found!');
    }

    const db = new DatabaseConnection();
    await db.connect();

    command = db.connection?.escape(command) || '';

    console.log(command);

    let sql: string = 
        `
        SELECT 
            COUNT(*) AS callCount
        FROM 
            Event
        WHERE (
            EventSource = 22
            AND ATTR_1 = 'Command call'
            AND ATTR_2 = ${command}
        );
        `;

    db.query(sql)
        .then(results => {
            const rows = results as Array<any>;
            const count = rows[0].callCount;
            res.json({
              "Command": command, 
              "Call Count": count
            });
        })
        .catch (err => {
            return res.status(500).send(err);
        });
});

module.exports = router;