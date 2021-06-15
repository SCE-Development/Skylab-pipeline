# Data pipeline

This is the data pipeline for SCE. It consists of the RDS data warehouse and its API.


## Set up the database on your local machine

1. Download MySQL Workbench from [here](https://dev.mysql.com/downloads/workbench/)
2. See [here](https://aws.amazon.com/premiumsupport/knowledge-center/rds-connect-ec2-bastion-host/)
and scroll down to the section on **Connect to the RDS DB instance from your local machine**
3. Credentials are provided by Jerry. Message shadowclaw#6023 on discord

## Development process

### Set up repo
#### Prerequisites
- [NodeJS](https://nodejs.org/en/download/)

#### Steps
1. `Git clone https://github.com/SCE-Development/Skylab-pipeline.git`
1. `cd` into `warehouse/` and type `npm install` to install dependencies
1. Copy `config.example.json` to `config.json` and fill out necessary info
1. `npm run dev` to connect to the database and start server

### AWS Architecture
![image](https://media.discordapp.net/attachments/768620968683241473/852091709058973736/unknown.png)

We use an EC2 as a bastion host to connect to the RDS database. 
Thus, the only thing that can communicate with the database is the
EC2 instance. Outside users, including yourself, may not connect. 

I have opened the RDS to the public for the purpose of this internship.
To lock it up, do the following steps
- Remove All TCP traffic from the security group
- Set public accessibility of the RDS database to **No**


### Testing queries

When testing a query, it is preferred that the database remains
unchanged if it does not need to be modified. Thus, the general
workflow would be to test the query, stub the data, and put it
together once both the query and endpoint works.

1. Test your queries using mySQL workbench
2. Stub the query json results in your endpoint
3. Use Postman to test the endpoint
4. Create a PR for the endpoint. 

