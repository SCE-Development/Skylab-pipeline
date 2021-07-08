// selecting from date 2021-04-19 
SELECT *, count(distinct userID) FROM Event JOIN Source on Event.EventSource = Source.Sourceid WHERE EventDate = "2021-04-19"

// inserting new row with fake data
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
    "Sucessful"
);

// select everything from event
select * from Event

// select everything from Source
select * from Source

// selects the distinct users from that date, also maybe try to figure out how to only grad the EventSource of 21
select EventDate, count(distinct userID) FROM Event where EventDate = '2021-04-19';

// selects the total users from that date, again, try to figure out how to only grab the EventSource of 21
select EventDate, count(userID) from Event WHERE EventDate = '2021-04-19' ;