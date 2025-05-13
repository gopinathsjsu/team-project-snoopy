import { query } from "./db";

export const getNodesData = async (db: any) => {
  const sql = `SELECT * FROM nodes`;

  console.log("sql is ", sql);
  const result = await query(db, sql, []);
  console.log("getNodesData result is ", result);

  return result;
};
