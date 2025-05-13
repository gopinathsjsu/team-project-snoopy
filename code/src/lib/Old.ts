import { clearFile } from "./CacheDb";
import { query } from "./db";
import md5 from "blueimp-md5";

export const nodes_table_name = (country?: string) => {
  if (!country) {
    return "nodes";
  }
  return `nodes_${country}`;
};

export const sqlTableExists = async (tableName: string) => {
  const sql = `SHOW TABLES FROM \`${process.env.DB_DATABASE}\` LIKE '${tableName}'`;

  return sql;
};

export const createTable = async (db: any, tableName: string) => {
  if (!db) {
    return null;
  }
  const sql = `CREATE TABLE ${tableName}(id int(11) NOT NULL AUTO_INCREMENT, title varchar(200) DEFAULT NULL, description text, created_dt varchar(200) DEFAULT NULL, updated_dt varchar(200) DEFAULT NULL, user_id varchar(200) DEFAULT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=utf8`;

  const [result] = await db.query(sql);

  const sql2 = await sqlTableExists(tableName);
  clearFile(md5(sql2));

  return result;
};

export const checkTableExists = async (
  db: any, // : Connection | undefined,
  tableName: string
) => {
  if (!db) {
    return null;
  }
  const sql = await sqlTableExists(tableName);
  const result = await query(db, sql, [], 60 * 60 * 24 * 365);

  const isTablePresent = result["0"];

  if (isTablePresent) {
    return true;
  }

  return false;
};
