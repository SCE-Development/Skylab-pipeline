--Insert frontend routes into source table
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