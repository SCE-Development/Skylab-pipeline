import mysql, { Types } from "mysql";
import { resolve } from "path/posix";
import {
  RDS_HOST_NAME,
  RDS_USER,
  RDS_PASSWORD,
  RDS_PORT,
  DATABASE
} from "../config/constants.json";

const DEFAULT_CONNECTION = {
  host: RDS_HOST_NAME,
  user: RDS_USER,
  password: RDS_PASSWORD,
  port: RDS_PORT,
  database: DATABASE
};

/**
 * Class for connecting to a MySQL database
 */
export class DatabaseConnection {
  connectionProperties: mysql.ConnectionConfig;
  connection: mysql.Connection | null;

  /**
   *
   * @param connectionProperties MySQL DB connection properties
   */
  constructor(
    connectionProperties: mysql.ConnectionConfig = DEFAULT_CONNECTION
  ) {
    this.connectionProperties = connectionProperties;
    this.connection = null;
  }

  /**
   * Connect to the database
   * @returns Connected database
   */
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.connection = mysql.createConnection(this.connectionProperties);
      this.connection.connect((err: Error) => {
        if (err) {
          // eslint-disable-next-line
          console.error("Database connection failed: " + err.stack);
          resolve(false);
        } else {
          // eslint-disable-next-line
          // console.log(
          //   `Connected to database on port ${this.connectionProperties.port}`
          // );
          resolve(true);
        }
      });
    });
  }

  /*
    Checks if connection is healthy
    @return boolean true if healthy and false if not
  */
  healthCheck(): boolean {
    return (this.connection as mysql.Connection).state === "authenticated";
  }

  /**
   * Close db connection
   * @param done A function supplied by mocha as a callback to
   * signify that we have completed stopping the server.
   */
  close(done?: any): void {
    // eslint-disable-next-line
    // console.log(`DB Connection closed`);
    (this.connection as mysql.Connection).end(done)
  }

  query(sql: string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      this.connection?.query(sql, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  }
}

module.exports = { DatabaseConnection };
