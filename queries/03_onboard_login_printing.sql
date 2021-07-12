-- selecting from date 2021-04-19 
SELECT *, count(distinct userID) FROM Event JOIN Source on Event.EventSource = Source.Sourceid WHERE EventDate = "2021-04-19"

-- inserting new row with fake data
INSERT into Event (
    EventSource,
    EventDate,
    EventTS,
    EventDescription,
    EventError,
    userID,
    ATTR_1
) VALUES (
	21,
    '2021-04-19',
    null,
    "Login Requested",
    False,
    "oixcjvlzknc09823l",
    "Successful"
);

-- insert printing query
INSERT into Event (
    EventSource,
    EventDate,
    EventTS,
    EventDescription,
    EventError,
    userID,
    ATTR_1,
    ATTR_2
) VALUES (
	23,
    '2021-04-20',
    null,
    "Printing",
    False,
    "u4qdfqGUpsr9JjHC",
    "Printer 2",
    6
);

-- select everything from event
select * from Event

-- select everything from Source
select * from Source

-- selects the distinct users from that date, also maybe try to figure out how to only grab the EventSource of 21
select EventDate, count(distinct userID) FROM Event where EventDate = '2021-04-19';

-- gets EventSource of 21 and only the successful ones
select EventDate, count(distinct userID) AS distinctSqlCount FROM Event WHERE (EventDate = '2021-04-19' AND EventSource = 21 AND ATTR_1 = 'Successful');
select EventDate, count(userID) AS totalSqlCount from Event WHERE (EventDate = '2021-04-19' AND EventSource = 21 AND ATTR_1 = 'Successful');

-- selects the total users from that date, again, try to figure out how to only grab the EventSource of 21
select EventDate, count(userID) from Event WHERE EventDate = '2021-04-19' ;

-- selects date, distinct logins, and total logins
select EventDate, count(distinct userID) AS distinctSqlCount, count(userID) AS totalSqlCount FROM Event WHERE (EventDate = '2021-04-19' AND EventSource = 21 AND ATTR_1 = "Successful");

-- selects the date, users printed, and number of pages printing for a specific date. it also groups
select EventDate, count(distinct userID) AS UsersPrinted, sum(ATTR_2) AS PagesPrinted FROM Event WHERE ((Event.EventDate BETWEEN (?) AND (?)) AND EventSource = 23) GROUP BY EventDate