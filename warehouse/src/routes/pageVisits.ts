import { CONNECTION } from "..";

const express = require('express');
const router = express.Router();

const recordPageVisits = function(page: string) {
    return new Promise(function(resolve, reject) {
        const sqlQuery = `SELECT count(*) as count FROM sys.Source WHERE sys.Source.SourcePage = ?`;

        CONNECTION.query(sqlQuery, page, function (error, results) {
            if (error != null || results === undefined) { 
                reject(error)
            }
            console.log("results:" + results[0].count);
            resolve(results[0].count);
        });
    });  
}    

async function queryDB(sqlQuery: string, sqlParam: string) {
    CONNECTION.query(sqlQuery, sqlParam, function (error, results, fields) {
        if (error != null) { 
            throw error;
        }
        console.log(results[0].count);
        //pageVisits = results[0].count;
        return results;
    });
}

//stub database 
function stubDatabaseWithPageVisits(): void {
    //stubbed data
    const page1 = "Event Page";
    const page2 = "Event Page";
    const page3 = "Event Page";
    const page4 = "Home Page";
    const page5 = "Home Page";
    const pages = [page1, page2, page3, page4, page5];
    const sqlQuery = `INSERT INTO sys.Source (sys.Source.SourcePage) 
                      VALUES(?), (?), (?), (?), (?)`;

    try {
        CONNECTION.query(sqlQuery, pages, function (error, results, fields) {
        if (error != null) { 
            throw error;
        }
    });
    } catch (e: unknown) {
        console.log("Error");
        return;
    }
}

//delete stubdata method after recordpagevisits
function deStubDatabaseWithPageVisits(): void {
    //stubbed data
    const sqlQuery = `DELETE FROM sys.Source WHERE
                      sys.Source.SourceID > 2`;

    try {
    CONNECTION.query(sqlQuery, function (error, results, fields) {
        if (error != null) { 
            throw error;
        }
    });
    } catch (e: unknown) {
        console.log("Error");
        return;
    }
}

router.get ('/pageVisits', async (req: any, res: any) => {
    //stubDatabaseWithPageVisits();
    var pageVisits = 0;
    await recordPageVisits("Event Page")
    .then(function(results) {
        pageVisits = results as number;
        console.log(pageVisits);
    })
    .catch(function(error) {
        console.log("Promise rejection error: "+error);
    });

    console.log("pgvisits:" + pageVisits);
    if (pageVisits > 0)
    {
        res.status(200).send();
    }
    else 
    {
        res.status(503).send(); 
    }
    //deStubDatabaseWithPageVisits();
    console.log("pagevisits:" + pageVisits);
});
module.exports = router;    //why do i need to do this?