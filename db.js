const mysql = require('mysql')
const {promisify} = require("util")

const pool =  mysql.createPool({
    host: 'localhost',
    port: "3306",
    user: 'root',
    password: 'password',
    database: 'restpractice',
    ssl:{
        rejectUnauthorized:false
    }
})

pool.getConnection((err,connection) => {
    if (err) {
      throw err;
    }
    if (connection) {
      connection.release();
      console.log("Connection released");
    }
  });

pool.query = promisify(pool.query)

module.exports = pool;