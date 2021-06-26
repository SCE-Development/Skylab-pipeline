import express from "express";
import { DatabaseConnection } from "../utils/DB";
const router = express.Router();
const CONNECTION = new DatabaseConnection();

const loginTraffic = function (date: string): Promise<void> {
  return new Promise(function (resolve, reject) {
    const sqlSelect = `select count(distinct userID) AS distinctSqlCount, count(userID) AS totalSqlCount FROM Event WHERE (EventDate = '${date}'AND EventSource = 21 AND ATTR_1 = "Successful");`;
    CONNECTION.connection?.query(sqlSelect, function (error, results) {
      if (error != null || results === undefined) {
        reject(error);
      }
      const rows = results as any;
      const distinctCount = rows;
      resolve(distinctCount);
    });
  });
};

router.get("/logintraffic", async (req: any, res: any) => {
  await CONNECTION.connect();
  const date = "2021-04-19";

  const distinctLogins = await loginTraffic(date)
    .then(function (results) {
      res.json({
        Date: date,
        "Login Traffic": results,
      });
    })
    .catch(function (error) {
      return res.status(503).send("Error querying database.");
    });

  res.status(200).send();
  if (req.query === undefined) {
    return res.status(400).send("Login traffic undefined.");
  }

  CONNECTION.close();
});

module.exports = router;
