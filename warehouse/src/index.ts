const mysql = require("mysql");
const {
  RDShostname,
  RDSuser,
  RDSpassword,
  RDSport
} = require("./config/constants.json");
function connectDatabase() {
  const con = mysql.createConnection({
    host: RDShostname,
    user: RDSuser,
    password: RDSpassword,
    port: RDSport,
  });

  con.connect(function (err: any) {
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }

    console.log("Connected to database.");
  });
  con.end();
}

connectDatabase();
