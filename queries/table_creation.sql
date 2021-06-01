-- Create source table
create table Source (
	SourceID int,
    SourceRepo varchar(255),
    SourcePage varchar(255),
    SourceEndpoint varchar(255)
);

-- Add a sample entry into source
INSERT into Source (
	SourceID, SourceRepo, SourcePage, SourceEndpoint
) VALUES (
	1, "Core-v4", "S3", "/s3"
);
