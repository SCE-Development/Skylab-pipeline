import { DatabaseConnection } from "./utils/DB";
import { ExpressServer } from "./utils/Server";
// import DatabaseConnection from "./utils/DB";
// import ExpressServer from "./utils/Server";
import {
  RDS_HOST_NAME,
  RDS_USER,
  RDS_PASSWORD,
  RDS_PORT,
  SERVER_PORT,
} from "./config/constants.json";

const connectionProperties = {
  host: RDS_HOST_NAME,
  user: RDS_USER,
  password: RDS_PASSWORD,
  port: RDS_PORT,
};

const DB = new DatabaseConnection(connectionProperties);
const SERVER = new ExpressServer(__dirname + '/routes/', SERVER_PORT);
SERVER.initializeEndpoints();

module.exports = { DB, SERVER }
