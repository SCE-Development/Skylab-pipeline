const express = require('express');
import { DatabaseConnection } from '../utils/DB'
const router = express.Router();
const CONNECTION = new DatabaseConnection();

/*
    Queries for amount of page visits per page
    Params: string array of pages
    Return: page visits per page
*/
const recordPageVisits = function(pages: string[]) {
    return new Promise(function(resolve, reject) {
        const sqlQuery = `SELECT sys.Source.SourcePage, count(sys.Event.EventSource) AS count 
                          FROM sys.Event JOIN sys.Source ON sys.Event.EventSource = sys.Source.SourceID
                          WHERE sys.Source.SourcePage 
                          IN (?) 
                          GROUP BY sys.Source.SourcePage;`
        ;
        (CONNECTION.connection)!.query(sqlQuery, [pages], function (error: any, results:any) {
            if (error != null || results === undefined) { 
                reject(error);  
            }

            var pageVisitsMap = new Map();
            
            //stores the results in a map
            for (const result of results) {
                pageVisitsMap.set(result.SourcePage, result.count); 
            }
            
            //checks for pages which weren't returned in results and adds them to map with default value of 0
            for (const page of pages) {
                if (!pageVisitsMap.has(page))
                {
                    pageVisitsMap.set(page, 0);
                }
            }
            resolve(pageVisitsMap); 
        });
    });  
}    

/*
    Queries for all the existing distinct pages
    Return: all existing distinct pages 
*/
const getAllDistinctPages = function() {
    return new Promise(function(resolve, reject) {
        const sqlQuery = `SELECT DISTINCT sys.Source.SourcePage AS pagename FROM sys.Source;`;
        (CONNECTION.connection)!.query(sqlQuery, function (error: any, results:any) {
            if (error != null || results === undefined) { 
                reject(error);  
            }
        
            const pages = results.map(page => page.pagename);
            resolve(pages); 
        });
    });  
} 

/* 
    creates a post API endpoint to test on at /pageVisits
    params: page    page to get page visits for
    return: page visits
*/
router.post('/pageVisits', async (req: any, res: any) => {

    //unpack JSON into string array of pages 
    let {
        pages
    }  = req.body;

    await CONNECTION!.connect();

    //check if req.body exists, else make default parameters all the pages
    if (pages === undefined) {
        pages = await getAllDistinctPages();    
    }   
    //test for bad input types(number, boolean, etc.), test for wrong page nam  e
    else if (!stringArrayCheck(pages))     
    {
        res.status(503).send(
            "Error querying database, check parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables."
        );
        return;
    }
    
    //stores results in a map
    let pageVisitsMap = new Map<string, number>();
    pageVisitsMap = await recordPageVisits(pages)
    .then(function(results) {
        return results as Map<string, number>;
    })
    .catch(function(error) {
        return res.status(503).send("Error querying database, check parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables.");    
    });

    res.status(200).send(JSON.stringify(Array.from(pageVisitsMap.entries())));

    CONNECTION.close();
});

/*
    Helper function, checks if all elements in array are strings
    param: array
    return: boolean, if array includes a non string
*/
function stringArrayCheck(pages) {
    return pages.every(page => (typeof page === "string"));
}

module.exports = router;    
