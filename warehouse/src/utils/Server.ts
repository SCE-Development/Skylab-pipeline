import express from "express";
import cors from "cors";
import fs from 'fs';

/**
 * Class for creating and initializing the Express server
 */
export class ExpressServer {

  pathToEndpoints: string;
  port: number;
  app: Express.Application;

  /**
   * 
   * @param pathToEndpoints Path to endpoints
   * @param port Server port
   */

  constructor(pathToEndpoints : string, port: number) {
    this.pathToEndpoints = pathToEndpoints;
    this.port = port;
    this.app = this._connectServer();
  }

  /**
   * Set up and connect to the server
   * @returns Connected server
   */
  _connectServer(): Express.Application {
    const app = express();
    app.use(cors());
    app.listen(this.port, () =>
      // eslint-disable-next-line
      console.log(`Server started at port ${this.port}`)
    );
    return app;
  }

  /**
   * Initialize endpoints for the express server
   */
  initializeEndpoints(): void {
    fs.readdir(this.pathToEndpoints, (err, files) => {
      files.forEach(file => {
        const route = this.pathToEndpoints + file;
        // Typecast this to any to resolve TS2339
        (this.app as any).use(require(route));
      })
    })
  }
}

exports = {ExpressServer}
module.exports = { ExpressServer };
