import express from 'express';
import { Request, Response } from 'express';

import { DatabaseConnection } from '../utils/DB';

const router = express.Router();

router.get('/commandCallCount', async (req: Request, res: Response) => {
  //Check if argument exists
  if (req.body.command == undefined) {
    return res.status(400).send('Commands not found!');
  }
  
  //argument type is a string array
  const commands: Array<string> = req.body.command as Array<string>;

  const db = new DatabaseConnection();
  await db.connect();

  const sql = 
    `
    SELECT 
	    ATTR_2 as command, COUNT(*) AS callCount
    FROM 
	    Event
    WHERE
	    EventSource = 22
	    AND ATTR_1 = 'Successful command call'
      AND ATTR_2 IN (?)
		GROUP BY 
	    ATTR_2;
    `;

  
  db.connection?.query(sql, [commands], (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    else {
      let commandCallResult: { [key: string]: number } = {};
      for (let row of result) {
        commandCallResult[row.command] = row.callCount;
      }
      res.json(commandCallResult);
    }
  });

  db.close();
});

module.exports = router;