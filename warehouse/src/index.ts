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


function connectDatabase(): void {
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
  con.end();
  return;
}

function connectServer(): void {
  const app = express();
  app.use(cors());
  app.listen(Expressport, () => 
    // eslint-disable-next-line
    console.log(`Server started at port ${Expressport}`)
  );
  return;
}


connectDatabase();
connectServer();
