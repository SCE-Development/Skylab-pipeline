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

router.get('/commandCallStats', async (req: Request, res: Response) => {

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
      DATE_FORMAT(EventDate, '%Y-%m-%d') as date,
      COUNT( CASE WHEN ATTR_1 = 'true' THEN 1 END ) AS successCount,
      COUNT( CASE WHEN ATTR_1 = 'false' THEN 1 END ) AS failCount
    FROM 
      Event
    WHERE
      EventSource = 22
      AND EventDate BETWEEN (?) AND (?)
    GROUP BY 
      EventDate;
    `;

  
  db.connection?.query(sql, [startDate, endDate], (error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    else {
      const commandCallResult: { [key: string]: any[] } = {};
      const stats = [];
      for (const row of result) {
        stats.push({
          eventDate: row.date,
          success: row.successCount,
          fail: row.failCount
        })
      }
      commandCallResult["stats"] = stats;
      res.status(200).json(commandCallResult);
    }
  });

  db.close();
});

module.exports = router;