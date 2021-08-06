import express from 'express';
import { Request, Response } from 'express';

import { DatabaseConnection } from '../utils/DB';

function isValidDate(dateString: string): boolean {
  const dateStringISO = dateString + "T00:00:00.000Z";
  if (new Date(dateStringISO) as unknown as string !== "Invalid Date" && !isNaN(new Date(dateStringISO) as unknown as number)) {
    return (dateStringISO == new Date(dateStringISO).toISOString());
  }
  else {
    return false;
  }
}

const router = express.Router();

router.post('/commandCallCount', async (req: Request, res: Response) => {
  //Check if argument exists
  if (req.body.command == undefined) {
    return res.status(400).send('Commands not found!');
  }

  //Argument type is a string array
  const commands: Array<string> = req.body.command as Array<string>;

  //Get optional arguments
  const { start_date, end_date } = req.body;
  const startDate = start_date ?? new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 3,
      new Date().getDate()
    )
    .toISOString()
    .split("T")[0];
  const endDate = end_date ?? new Date()
    .toISOString()
    .split("T")[0];
  
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return res.status(400).send('Invalid date format!');
  }

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
	    AND ATTR_1 = 'True'
      AND ATTR_2 IN (?)
      AND EventDate BETWEEN (?) AND (?)
		GROUP BY 
	    ATTR_2;
    `;

  
  db.connection?.query(sql, [commands, startDate, endDate], (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    else {
      const commandCallResult: { [key: string]: number } = {};
      for (const row of result) {
        commandCallResult[row.command] = row.callCount;
      }
      res.status(200).json(commandCallResult);
    }
  });

  db.close();
});

module.exports = router;