//import { CONNECTION } from "..";

const express = require('express');
const router = express.Router();

//UNFINISHED METHOD
function rdsHealthCheck(): boolean {
    //const sql = 'select * from sys.Event';
    
    //const result = CONNECTION.query(sql);
    //console.log(result);
    
    return false;
}

/* creates API endpoint to test on at localhost:8000/healthcheck */
// eslint-disable-next-line
router.get('/healthcheck', (req: any, res: any) => {
   
    rdsHealthCheck();
    res.status(200).send();
})

module.exports = router;