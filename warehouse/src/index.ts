import { ExpressServer } from "./utils/Server";
import {
  SERVER_PORT,
} from "./config/constants.json";
const connection = require("./connection");


const SERVER = new ExpressServer(__dirname + '/routes/', SERVER_PORT, connection);
SERVER.initializeEndpoints();
SERVER.connectServer();

module.exports = SERVER 
