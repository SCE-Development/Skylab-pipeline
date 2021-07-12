import express from "express";
import { DatabaseConnection } from "../utils/DB";
const router = express.Router();
const CONNECTION = new DatabaseConnection();

/*
    Inserts row into Event table with given parameters
    @param: map of values of columns mapped to column values
*/
const insertEventTableColumns = function (eventTableColumns: Map<string, any>): Promise<void> { 
    const columns: string[] = []
    const values: any[] = []
    eventTableColumns.forEach((colValue: any, col: string) => {
        columns.push(col);
        values.push(colValue);
    });

    return new Promise(function (resolve, reject) {
        const sqlQuery = `INSERT INTO Event (` + columns + `) VALUES (?)`;
        CONNECTION.connection?.query( sqlQuery, [values], function (error) {
            if (error != null) {
                reject(error);
            }
            resolve();
        });
    });
};

/* 
    creates a get API endpoint to use at /etlEndpoint
    @params:  eventSource,
              userID,
              ssoid,
              eventDate,
              eventTS,
              eventDescription,
              eventError,
              attr_1,
              attr_2,
              attr_3,
              attr_4,
              attr_5,
              attr_JSON     parameters to insert into Event table row
    @return: http status code informing whether successful insertion occured
*/
router.get("/etlEndpoint", async (req, res) => {

    const {
        eventSource,
        userID,
        ssoid,
        eventDate,
        eventTS,
        eventDescription,
        eventError,
        attr_1,
        attr_2,
        attr_3,
        attr_4,
        attr_5,
        attr_JSON,
    } = req.body;

    const eventTableColumns = new Map<string, any>();
    
    eventTableColumns.set("EventSource", eventSource);
    eventTableColumns.set("UserID",userID);
    eventTableColumns.set("SSOID", ssoid);
    eventTableColumns.set("EventDate", eventDate);
    eventTableColumns.set("EventTS", eventTS);
    eventTableColumns.set("EventDescription", eventDescription);
    eventTableColumns.set("EventError", eventError);
    eventTableColumns.set("ATTR_1", attr_1);
    eventTableColumns.set("ATTR_2", attr_2);
    eventTableColumns.set("ATTR_3", attr_3);
    eventTableColumns.set("ATTR_4", attr_4);
    eventTableColumns.set("ATTR_5", attr_5);
    eventTableColumns.set("ATTR_JSON", attr_JSON);

    await CONNECTION?.connect();

    const response = await insertEventTableColumns(eventTableColumns)
      .then(function () {
        return res.status(200).send();
      })
      .catch(function (error) {
        return res
            .status(400)
            .send(
            "Error inserting into database, check parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables."
            );
      });

    CONNECTION.close();
    return response;
});

module.exports = router;