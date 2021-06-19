import mysql from "mysql";

/**
 * Class for connecting to a MySQL database
 */
export class DatabaseConnection {

  connectionProperties: mysql.ConnectionConfig;
  connection: mysql.Connection;

  /**
   * 
   * @param connectionProperties MySQL DB connection properties
   */
  constructor(connectionProperties: mysql.ConnectionConfig) {
    this.connectionProperties = connectionProperties;
    this.connection = this._connectDatabase();
  }

  /**
   * Connect to the database
   * @returns Connected database
   */
  _connectDatabase(): mysql.Connection {
    const connection = mysql.createConnection(this.connectionProperties);
  
    connection.connect((err: Error) => {
      if (err) {
        // eslint-disable-next-line
        console.error("Database connection failed: " + err.stack);
        return;
      }
      // eslint-disable-next-line
      console.log(`Connected to database on port ${this.connectionProperties.port}`);
    });
    return connection;
  }
}

module.exports = { DatabaseConnection };
