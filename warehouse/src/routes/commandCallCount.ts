import express from 'express';
import { Request, Response } from 'express';

import { DatabaseConnection } from '../utils/DB';

const router = express.Router();

router.get('/commandCallCount', async (req: Request, res: Response) => {
  if (req.body.command == undefined) {
    return res.status(400).send('Command not found!');
  }

  let command: string = req.body.command as string;

  if (command == null) {
    return res.status(400).send('Command not found!');
  }

  const db = new DatabaseConnection();
  await db.connect();

  const sql = 
    `
    SELECT 
      COUNT(*) AS callCount
    FROM 
      Event
    WHERE (
      EventSource = 22
      AND ATTR_1 = 'Successful command call'
      AND ATTR_2 = ?
    );
    `;
  
  db.connection?.query(sql, [command], (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    else {
      const callCount = results[0].callCount;
      res.json({
        "Command": command, 
        "Call Count": callCount
      });
    }
  });

  // db.query(sql)
  //   .then(results => {
  //     const count = results[0].callCount;
  //     res.json({
  //       "Command": command, 
  //       "Call Count": count
  //     });
  //   })
  //   .catch (err => {
  //     return res.status(500).send(err);
  //   });
});

module.exports = router;