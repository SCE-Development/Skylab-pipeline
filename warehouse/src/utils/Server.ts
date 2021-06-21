import express from "express";
import cors from "cors";
import fs from "fs";
import http from "http";
import { DatabaseConnection } from "./DB";

/**
 * Class for creating and initializing the Express server
 */
export class ExpressServer {
  pathToEndpoints: string;
  port: number;
  app: any;
  server: http.Server;
  connection: DatabaseConnection | undefined;

  /**
   *
   * @param pathToEndpoints Path to endpoints
   * @param port Server port
   */

  constructor(
    pathToEndpoints: string,
    port: number,
    connection?: DatabaseConnection
  ) {
    this.pathToEndpoints = pathToEndpoints;
    this.port = port;
    this.server = http.createServer();
    this.connection = connection;
    this.app = express();
    this.app.use(cors());
  }

  /**
   * Set up and connect to the server
   * @returns Connected server
   */
  connectServer(): http.Server {
    const server = http.createServer(this.app);
    server.listen(this.port, () =>
      // eslint-disable-next-line
      console.log(`Server started at port ${this.port}`)
    );
    return server;
  }

  /**
   * Initialize endpoints for the express server
   */
  initializeEndpoints(): void {
    fs.readdir(this.pathToEndpoints, (err, files) => {
      files.forEach((file) => {
        const route = this.pathToEndpoints + file;
        this.app.use(require(route));
      });
    });
  }

  /**
   * Close the connection to mySQL and stop the server.
   * @param {Function|null} done A function supplied by mocha as a callback to
   * signify that we have completed stopping the server.
   */
  closeConnection(done?: any): void {
    this.server.close();
    if (this.connection) {
      (this.connection as DatabaseConnection).close(done);
    } else{
      done();
    }
  }
}

module.exports = { ExpressServer };
