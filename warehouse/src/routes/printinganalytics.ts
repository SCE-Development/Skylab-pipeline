import express from "express";
import { DatabaseConnection } from "../utils/DB";
const router = express.Router();
const CONNECTION = new DatabaseConnection();

const printingAnalytics = function (dates: string[]): Promise<void> {
  return new Promise(function (resolve, reject) {
    const sqlSelect = `select count(distinct userID) AS UsersPrinted, 
                      sum(ATTR_2) AS PagesPrinted FROM Event WHERE 
                      ((Event.EventDate BETWEEN (?) AND (?)) AND EventSource = 23)`;

    CONNECTION.connection?.query(
      sqlSelect,
      [dates[0], dates[1]],
      function (error, results) {
        if (error != null || !results || !results.length) {
          reject(error);
        }

        resolve(results as any);
      }
    );
  });
};

function checkDate(dateString: string): boolean {
  const date = new Date(dateString);
  return (
    !isNaN(date.getTime()) ||
    !isNaN(date.valueOf()) ||
    !(date.toString() === "Invalid Date")
  );
}

router.get("/printinganalytics", async (req: any, res: any) => {
  await CONNECTION.connect();
  let { startDate, endDate } = req.body;

  if (startDate > endDate) {
    return res
      .status(400)
      .send("Error querying database, check date parameters.");
  }

  startDate =
    startDate ??
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 3,
      new Date().getDate()
    )
      .toISOString()
      .split("T")[0];

  endDate = endDate ?? new Date().toISOString().split("T")[0];

  if (!checkDate(startDate) || !checkDate(endDate)) {
    return res
      .status(400)
      .send("Error querying database, check date parameters.");
  }

  const betweenDates: [string, string] = [startDate, endDate];

  const logins = await printingAnalytics(betweenDates)
    .then(function (results) {
      res.json({
        Date: "Between " + startDate + " and " + endDate,
        "Printing Analytics": results,
      });
      return results;
    })
    .catch(function (error) {
      return res.status(503).send("Error querying database.");
    });

  CONNECTION.close();
});

module.exports = router;
