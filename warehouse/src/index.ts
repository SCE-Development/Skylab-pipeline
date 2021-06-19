import mysql from "mysql";
import express from "express";
import cors from "cors";
import {
  RDShostname,
  RDSuser,
  RDSpassword,
  RDSport,
  Expressport
} from "./config/constants.json";

  function connectDatabase(): mysql.Connection {
    const con = mysql.createConnection({
      host: RDShostname,
      user: RDSuser,
      password: RDSpassword,
      port: RDSport,
    });

    con.connect(function (err: Error) {
      if (err) {
        // eslint-disable-next-line
        console.error("Database connection failed: " + err.stack);
        return;
      }
      // eslint-disable-next-line
      console.log("Connected to database.");
    });
    con.destroy();
    //con.end();
    return con;
  }

  function closeDatabase(): void {
    CONNECTION.end();
  }

  function connectServer(): express.Application {
    const app = express();
    app.use(cors());
    const healthCheckFile = require("./routes/healthcheck")
    app.use(healthCheckFile)
    app.listen(Expressport, () => 
      // eslint-disable-next-line
      console.log(`Server started at port ${Expressport}`)
    );
    return app;
  }

  function closeServer(): void {

  }

export const APP = connectServer();
export const CONNECTION = connectDatabase();
