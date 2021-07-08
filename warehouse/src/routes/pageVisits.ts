import express from "express";
import { DatabaseConnection } from "../utils/DB";
const router = express.Router();
const CONNECTION = new DatabaseConnection();

/*
    Queries for amount of page visits per page
    @param: string array of pages
    @returns: page visits per page
*/
const recordPageVisits = function (
  pages: string[],
  dates: string[]
): Promise<Map<string, number>> {
  return new Promise(function (resolve, reject) {
    const sqlQuery = `SELECT Source.SourcePage, count(Event.EventSource) AS count 
                          FROM Event JOIN Source ON Event.EventSource = Source.SourceID
                          WHERE Source.SourcePage 
                          IN (?) 
                          AND 
                          Event.EventDate BETWEEN (?) AND (?)
                          GROUP BY Source.SourcePage;`;
    CONNECTION.connection?.query(
      sqlQuery,
      [pages, dates[0], dates[1]],
      function (error, results) {
        if (error != null || !results || !results.length) {
          reject(error);
        }

        const pageVisitsMap = new Map();

        //stores the results in a map
        for (const result of results) {
          pageVisitsMap.set(result.SourcePage, result.count);
        }

        //checks for pages which weren't returned in results and adds them to map with default value of 0
        for (const page of pages) {
          if (!pageVisitsMap.has(page)) {
            pageVisitsMap.set(page, 0);
          }
        }
        resolve(pageVisitsMap);
      }
    );
  });
};

/*
    Queries for all the existing distinct pages from frontend
    @returns: all existing distinct pages from frontend
*/
const getAllDistinctPages = function (dates: string[]): Promise<void> {
  return new Promise(function (resolve, reject) {
    const sqlQuery = `SELECT DISTINCT Source.SourcePage AS pagename 
                          FROM Source JOIN Event ON Event.EventSource = Source.SourceID 
                          WHERE Source.SourceRepo = "Core-V4 frontend" AND Event.EventDate BETWEEN (?) AND (?);`;
    CONNECTION.connection?.query(
      sqlQuery,
      [dates[0], dates[1]],
      function (error, results) {
        if (error != null || !results || !results.length) {
          reject(error);
        }

        const pages = results.map((page: any) => page.pagename);
        resolve(pages);
      }
    );
  });
};

/*
    Helper function, checks if all elements in array are strings
    @param: array
    @returns: boolean, if array includes a non string
*/
function stringArrayCheck(pages: any): boolean {
  if (!(pages instanceof Array)) {
    return false;
  }
  return pages.every((page) => typeof page === "string" && page.match("/.*"));
}

/*
    Helper function, checks if string is a date
    @params: dateString string hopefully representing a date
    @returns: boolean, if string is a date
*/
function checkDate(dateString: string): boolean {
  const date = new Date(dateString);
  return (
    !isNaN(date.getTime()) ||
    !isNaN(date.valueOf()) ||
    !(date.toString() === "Invalid Date")
  );
}

/* 
    creates a get API endpoint to use at /pageVisits
    @params: pages    pages to get page visits for
    @returns: page visits per page
*/
router.get("/pageVisits", async (req, res) => {
  //unpack JSON into string array of pages
  let { pages } = req.body;

  const { start_date, end_date } = req.body;

  // if start_date exists, take start_date. Otherwise, set it to 3 months before today
  const startDate =
    start_date ??
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 3,
      new Date().getDate()
    )
      .toISOString()
      .split("T")[0];

  // if end_Date exists, take end_date. Otherwise, set it to today
  const endDate = end_date ?? new Date().toISOString().split("T")[0];

  const betweenDates: [string, string] = [startDate, endDate];

  if (!checkDate(startDate) || !checkDate(endDate)) {
    return res
      .status(400)
      .send(
        "Error querying database, check date parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables."
      );
  }

  await CONNECTION?.connect();

  //check if req.body exists, else make default parameters all the pages
  if (pages === undefined) {
    pages = await getAllDistinctPages(betweenDates)
      .then(function (results) {
        return results;
      })
      .catch(function (error) {
        CONNECTION.close();
        return res
          .status(400)
          .send(
            "Error querying database, check pages parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables."
          );
      });
  }

  //test for bad input types(number, boolean, etc.), test for wrong page name
  else if (!stringArrayCheck(pages)) {
    CONNECTION.close();
    res
      .status(400)
      .send(
        "Error querying database, check pages parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables."
      );
    return;
  }

  //stores results in a map
  const pageVisitsMap = (await recordPageVisits(pages, betweenDates)
    .then(function (results) {
      return results as Map<string, number>;
    })
    .catch(function (error) {
      CONNECTION.close();
      return res
        .status(503)
        .send(
          "Error querying database, check parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables."
        );
    })) as Map<string, number>;

  CONNECTION.close();
  return res
    .status(200)
    .send(JSON.stringify(Array.from(pageVisitsMap.entries())));
});

module.exports = router;
