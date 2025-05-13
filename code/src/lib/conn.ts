import mysql from "mysql2/promise";

let dbPool = null;

export const createConnection: any =
  dbPool ??
  (() => {
    const newPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectionLimit: 10,
    });
    dbPool = newPool;
    return newPool;
  })();

// export const createPool = async () => {
//   const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     // waitForConnections: true,
//     // connectionLimit: 10,
//     // maxIdle: 10,
//     // idleTimeout: 60000,
//     // queueLimit: 0,
//   });

//   return pool;
// };

// export const createConnection1 = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//       // waitForConnections: true,
//       // connectionLimit: 10,
//       // maxIdle: 10,
//       // idleTimeout: 60000,
//       // queueLimit: 0,
//     });

//     return connection;
//   } catch (err) {
//     console.log("err is ", err);
//   }
// };
