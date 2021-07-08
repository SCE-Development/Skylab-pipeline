INSERT INTO Source (
    SourceRepo,
    SourcePage,
    SourceEndpoint
) VALUES (
    "SCE-discord-bot",
    null,
    null
);

INSERT INTO Event (
    EventSource,
    EventDate,
    EventDescription,
    EventError,
    ATTR_1,
    ATTR_2
) VALUES (
    22,
    '2021-01-01',
    'Discord activities',
    False,
    'Successful command call',
    's!mute'
);

SELECT 
    COUNT(*) AS callCount
FROM 
    Event
WHERE (
    EventSource = 22
    AND ATTR_1 = 'Command call'
    AND ATTR_2 = 's!mute'
);

SELECT 
	ATTR_2 as command, COUNT(*) AS callCount
FROM 
	Event
WHERE
	EventSource = 22
	AND ATTR_1 = 'Successful command call'
    AND ATTR_2 IN
		('s!mute', 'kick', 'announce everyone')
GROUP BY 
	ATTR_2;

SELECT 
  ATTR_2 as command, COUNT(*) AS callCount
FROM 
  Event
WHERE
  EventSource = 22
  AND ATTR_1 = 'Successful command call'
  AND ATTR_2 
IN (?)
  AND EventDate BETWEEN (?) AND (?)
GROUP BY 
  ATTR_2;