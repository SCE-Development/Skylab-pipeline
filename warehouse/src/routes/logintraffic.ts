import express from "express";
import { DatabaseConnection } from "../utils/DB";
const router = express.Router();
const CONNECTION = new DatabaseConnection();

const loginDistinct = function (date: string): Promise<void> {
  return new Promise(function (resolve, reject) {
    const distinctSqlSelect = `select EventDate, count(distinct userID) AS distinctSqlCount FROM Event WHERE (EventDate = '2021-04-19' AND EventSource = 21 AND ATTR_1 = 'Successful');`;
    CONNECTION.connection?.query(distinctSqlSelect, function (error, results) {
      if (error != null || results === undefined) {
        reject(error);
      }

      const rows = results as any;
      const distinctCount = rows[0].distinctSqlCount;
      resolve(distinctCount);
    });
  });
};

const loginTotal = function (date: string): Promise<void> {
  return new Promise(function (resolve, reject) {
    const totalSqlSelect = `select EventDate, count(userID) AS totalSqlCount from Event WHERE (EventDate = '2021-04-19' AND EventSource = 21 AND ATTR_1 = 'Successful');`;
    CONNECTION.connection?.query(totalSqlSelect, function (error, results) {
      if (error != null || results === undefined) {
        reject(error);
      }

      const rows = results as any;
      const totalCount = rows[0].totalSqlCount;
      resolve(totalCount);
    });
  });
};

router.get("/logintraffic", async (req: any, res: any) => {
  await CONNECTION.connect();
  const date = "2021-04-2019";

  const distinctLogins = await loginDistinct(date).then(function (results) {
    res.json({
      Date: date,
      "Distinct Logins": results,
    });
  });

  const totalLogins = await loginTotal("2021-04-19").then(function (results) {
    res.json({
      Date: date,
      "Total Logins": results,
    });
  });

  res.status(200).send();
  if (req.query === undefined) {
    return res.status(400).send("Login traffic undefined.");
  }

  CONNECTION.close();
});

module.exports = router;
