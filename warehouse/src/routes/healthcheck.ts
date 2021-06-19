import { CONNECTION } from "..";

const express = require('express');
const router = express.Router();

/*
    Checks if connection is healthy
    @return boolean true if healthy and false if not
*/
function rdsHealthCheck(): boolean {
    if(CONNECTION.state == "disconnected" || CONNECTION == null)
    {
        return false;
    }
    return true;
}

/* creates API endpoint to test on at localhost:8000/healthcheck */
// eslint-disable-next-line
router.get('/healthCheck', (req: any, res: any) => {
    const healthy = rdsHealthCheck();
    if (healthy)
    {
        res.status(200).send();
    }
    else
    {
        res.status(503).send();
    }      
});

module.exports = router;
