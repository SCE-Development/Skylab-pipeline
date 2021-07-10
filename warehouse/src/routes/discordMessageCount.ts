import express from 'express';
import { Request, Response } from 'express';

import { DatabaseConnection } from '../utils/DB';

const router = express.Router();

router.get('/discordMessageCount', async (req: Request, res: Response) => {
  let sql: string;
  const db = new DatabaseConnection();
  await db.connect();

  //If date exist, pull from that specific date. Otherwise pull from a range
  const { date, start_date, end_date } = req.body;
  if (date != undefined) {
    if (!isValidDate(date)) {
      return res.status(400).send('Invalid date format!');
    }

    sql = 
    `
      SELECT 
        EventDate as messageDate, COUNT(*) AS messageCount
      FROM 
        Event
      WHERE
        EventSource = 22
        AND ATTR_1 = 'Message'
        AND EventDate = (?)
      GROUP BY 
        EventDate;
    `;
    
    db.connection?.query(sql, [date], (error, result) => {
      if (error) {
        return res.status(500).send(error);
      }
      else {
        const messageCountResult: { [key: string]: number } = {};
        for (const row of result) {
          messageCountResult[row.messageDate] = row.messageCount;
        }
        res.status(200).json(messageCountResult);
      }
    });
  }
  else {
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

    sql = 
    `
      SELECT 
        EventDate as messageDate, COUNT(*) AS messageCount
      FROM 
        Event
      WHERE
        EventSource = 22
        AND ATTR_1 = 'Message'
        AND EventDate BETWEEN (?) AND (?)
      GROUP BY 
        EventDate;
    `;
    
    db.connection?.query(sql, [startDate, endDate], (error, result) => {
      if (error) {
        return res.status(500).send(error);
      }
      else {
        let totalCount = 0;

        const messageCountResult: { [key: string]: number } = {};
        for (const row of result) {
          totalCount += row.messageCount;
          messageCountResult[row.messageDate] = row.messageCount;
        }
        messageCountResult['total'] = totalCount;
        res.status(200).json(messageCountResult);
      }
    });
  }
});

function isValidDate(dateString: string): boolean {
  const dateStringISO = dateString + "T00:00:00.000Z";
  if (new Date(dateStringISO) as unknown as string !== "Invalid Date" && !isNaN(new Date(dateStringISO) as unknown as number)) {
    return (dateStringISO == new Date(dateStringISO).toISOString());
  }
  else {
    return false;
  }
}

module.exports = router;