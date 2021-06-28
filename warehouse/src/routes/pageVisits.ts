import express, { json } from 'express';
import { start } from 'repl';
import { DatabaseConnection } from '../utils/DB';
const router = express.Router();
const CONNECTION = new DatabaseConnection();

/*
    Queries for amount of page visits per page
    @param: string array of pages
    @returns: page visits per page
*/
const recordPageVisits = function(pages: string[], dates: string[]): Promise<Map<string, number>> {
    return new Promise(function(resolve, reject) {
        const sqlQuery = `SELECT Source.SourcePage, count(Event.EventSource) AS count 
                          FROM Event JOIN Source ON Event.EventSource = Source.SourceID
                          WHERE Source.SourcePage 
                          IN (?) 
                          AND 
                          Event.EventDate BETWEEN (?) AND (?)
                          GROUP BY Source.SourcePage;`;
        (CONNECTION.connection)?.query(sqlQuery, [pages, dates[0], dates[1]], function (error, results) 
        {
            
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
    Queries for all the existing distinct pages from frontend
    @returns: all existing distinct pages from frontend
*/
const getAllDistinctPages = function(dates: string[]): Promise<void> {
    return new Promise(function(resolve, reject) {
        const sqlQuery = `SELECT DISTINCT Source.SourcePage AS pagename 
                          FROM Source JOIN Event ON Event.EventSource = Source.SourceID 
                          WHERE Source.SourceRepo = "Core-V4 frontend" AND Event.EventDate BETWEEN (?) AND (?);`;
        (CONNECTION.connection)?.query(sqlQuery, [dates[0],dates[1]], function (error, results) {
            if (error != null || !results || !results.length) { 
                reject(error);  
            }
    
            const pages = results.map((page: any) => page.pagename);
            resolve(pages); 
        });
    });  
} 

/*
    Helper function, checks if all elements in array are strings
    @param: array
    @returns: boolean, if array includes a non string
*/
function stringArrayCheck(pages: any): boolean {
    if (!(pages instanceof Array))
    {   
        return false;
    }
    return pages.every(page => (typeof page === "string" && page.match("/.*")));
}

/*
    Helper function, checks if all elements in array are strings
    @params: array
    @returns: boolean, if array includes a non string
*/
function checkDate(date: Date): boolean {
    return !(date.toString() === "Invalid Date") && !(isNaN(date.getTime())) && !(isNaN(date.valueOf()));
}

/* 
    creates a get API endpoint to use at /pageVisits
    @params: pages    pages to get page visits for
    @returns: page visits per page
*/
router.get('/pageVisits', async (req, res) => {
    //unpack JSON into string array of pages 
    let {
        pages
    }  = req.body;
    
    const {
        start_date, end_date
    } = req.body;
    
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    let betweenDates: [string, string] = ["", ""];

    //check if date parameters were given else give default parameters
    if (start_date === undefined && end_date === undefined) {
        const today = new Date();
        betweenDates[1] = today.toISOString().split('T')[0];
        
        today.setMonth(today.getMonth() - 3);
        betweenDates[0] = today.toISOString().split('T')[0];
    }
 
    //check if dates are valid
    else if (!checkDate(startDate) || !checkDate(endDate)) {
        return res.status(400).send("Error querying database, check date parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables.");    
    }
    else 
    {
        //mySQL compatible tuple of dates
        betweenDates = [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]];
    }

    await CONNECTION?.connect();

    //check if req.body exists, else make default parameters all the pages
    if (pages === undefined) {
        pages = await getAllDistinctPages(betweenDates)
        .then(function(results) {
            return results;
        })
        .catch(function(error) {
            CONNECTION.close();
            return res.status(400).send("Error querying database, check pages parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables.");    
        }); 
    }

    //test for bad input types(number, boolean, etc.), test for wrong page name
    else if (!stringArrayCheck(pages))     
    {
        CONNECTION.close();
        res.status(400).send(
            "Error querying database, check pages parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables."
        );
        return;
    } 

    //stores results in a map
    const pageVisitsMap = (await recordPageVisits(pages, betweenDates)
    .then(function(results) {
        return results as Map<string, number>;
    })
    .catch(function(error) {
        CONNECTION.close();
        return res.status(503).send("Error querying database, check parameters. Refer to https://github.com/SCE-Development/Skylab-pipeline/wiki/Source-tables.");    
    })) as Map<string, number>;

    CONNECTION.close();
    return res.status(200).send(JSON.stringify(Array.from(pageVisitsMap.entries())));
});

module.exports = router;    