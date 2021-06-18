import { CONNECTION } from "..";

const express = require('express');
const router = express.Router();

/*
    Checks if connection is healthy
    @return boolean true if healthy and false if not
*/
function rdsHealthCheck(): boolean {
    const sqlQuery = 'select * from sys.Event';
    if (CONNECTION.state == "disconnected") {
        return false;
    }
    try {
        CONNECTION.query(sqlQuery, function (error, results, fields) {
            if (error != null) { 
                return false;
            }
        });
    } catch (e: unknown) {
        return false;
    }
    return true;
}

/* creates API endpoint to test on at localhost:8000/healthcheck */
// eslint-disable-next-line
router.get('/healthcheck', (req: any, res: any) => {
    res.send(rdsHealthCheck());
    res.status(200).send();
})

module.exports = router;