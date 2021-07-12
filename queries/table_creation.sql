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