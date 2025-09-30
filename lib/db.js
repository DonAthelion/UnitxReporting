import mysql from "mysql2/promise";

let _pool;

export function getPool() {
  if (!_pool) {
    _pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 4,
      waitForConnections: true,
      multipleStatements: false,
      timezone: 'Z'
    });
  }
  return _pool;
}
