import express from "express";
import { DatabaseConnection } from "../utils/DB";
const router = express.Router();
const CONNECTION = new DatabaseConnection();

const printingAnalytics = function (dates: string[]): Promise<void> {
  return new Promise(function (resolve, reject) {
    const sqlSelect = `select EventDate, count(distinct userID) AS UsersPrinted, 
                      sum(ATTR_2) AS PagesPrinted FROM Event WHERE 
                      ((Event.EventDate BETWEEN (?) AND (?)) AND EventSource = 23) GROUP BY EventDate`;

    CONNECTION.connection?.query(
      sqlSelect,
      [dates[0], dates[1]],
      function (error, results) {
        if (error != null || !results || !results.length) {
          reject(error);
        }
        const rows = results as any;

        try {
          for (let i = 0; i < rows.length; i += 1) {
            results[i].EventDate = new Date(results[i].EventDate)
              .toISOString()
              .slice(0, 10);
          }
        } catch {
          results = null;
        }

        resolve(results);
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

router.post("/printingAnalytics", async (req: any, res: any) => {
  await CONNECTION.connect();

  let { start_date, end_date } = req.body;


  if (start_date > end_date) {
    return res
      .status(400)
      .send("Error querying database, check date parameters.");
  }

  start_date =
    start_date ??
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 3,
      new Date().getDate()
    )
      .toISOString()
      .split("T")[0];

  end_date =
    end_date ??
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
      .toISOString()
      .split("T")[0];

  if (!checkDate(start_date) || !checkDate(end_date)) {
    return res
      .status(400)
      .send("Error querying database, check date parameters.");
  }

  const betweenDates: [string, string] = [start_date, end_date];

  printingAnalytics(betweenDates)
    .then(function (results) {
      res.json({
        Date: "Between " + start_date + " and " + end_date,
        Data: results,
      });
    })
    .catch(function (error) {
      return res.status(503).send("Error querying database.");
    });

  CONNECTION.close();
});

module.exports = router;
