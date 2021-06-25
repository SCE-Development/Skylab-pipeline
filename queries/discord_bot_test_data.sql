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
    'Command call',
    's!mute'
);

SELECT 
    COUNT(*)
FROM 
    Event
WHERE (
    EventSource = 22
    AND ATTR_1 = 'Command call'
    AND ATTR_2 = 's!mute'
);