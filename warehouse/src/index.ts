import { ExpressServer } from "./utils/Server";
import {
  SERVER_PORT,
} from "./config/constants.json";


const SERVER = new ExpressServer(__dirname + '/routes/', SERVER_PORT);
SERVER.initializeEndpoints();
SERVER.connectServer();

module.exports = SERVER 
