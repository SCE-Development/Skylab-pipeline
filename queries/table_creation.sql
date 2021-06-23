-- Create Source table
create table Source (
	SourceID int not null auto_increment,
    SourceRepo varchar(255),
    SourcePage varchar(255),
    SourceEndpoint varchar(255),
    primary key(SourceID)
);

-- Create Event table
create table Event (
	EventID int not null auto_increment,
    EventSource int,
    EventDate DATE,
    EventTS TIMESTAMP,
    EventDescription varchar(1000),
    EventError boolean,
    ATTR_1 varchar(255),
    ATTR_2 varchar(255),
    ATTR_3 varchar(255),
    ATTR_4 varchar(255),
    ATTR_5 varchar(255),
    ATTR_JSON nvarchar(4000),
    primary key(EventID),
    foreign key(EventSource) references Source(SourceID)
    on update cascade on delete cascade
);

-- Add sample data
INSERT into Source (
	SourceRepo, SourcePage, SourceEndpoint
) VALUES (
    "Core-v4", "S3", "/s3"
);

INSERT into Event (
    EventSource,
    EventDate,
    EventTS,
    EventDescription,
    EventError,
    ATTR_1,
    ATTR_2,
    ATTR_3,
    ATTR_4,
    ATTR_5
) VALUES (
	1,
    '2021-04-19',
    null,
    "Core-v4 S3 adding habib.png to sample bucket",
    False,
    "Sample bucket",
    "12345",
    "habib.png",
    null,
    null
);

-- Add user info in table
ALTER TABLE Event
ADD COLUMN UserID varchar(255) AFTER EventSource,
ADD COLUMN SSOID varchar(255) AFTER EventSource;

INSERT INTO Source (SourceID, SourceRepo, SourcePage) 
VALUES
	(3, 'Core-v4', '/dashboard'),
	(4,'Core-v4', '/email-list'),
    (5,'Core-v4', '/event-manager'),
    (6, 'Core-v4', '/3DConsole'), 
    (7,'Core-v4', '/led-sign'),
    (8,'Core-v4', '/3DPrintingForm'),
    (9,'Core-v4', '/2DPrinting'),
    (10,'Core-v4', '/login'),
    (11,'Core-v4', '/register'),
    (12,'Core-v4', '/profile'),
    (13,'Core-v4', '/printing-analytics'),
    (14,'Core-v4', '/uploadPic'),
    (15,'Core-v4', '/'),
    (16,'Core-v4', '/events'),
    (17,'Core-v4', '/officerDB'),
    (18,'Core-v4', '/team'),
    (19,'Core-v4', '/verify'),
    (20,'Core-v4', '/discordSJSU/LoginWithGoogle/:id');

UPDATE Source SET Source.SourceRepo = "Core-V4 frontend" WHERE Source.SourceRepo = "Core-v4" LIMIT 20;