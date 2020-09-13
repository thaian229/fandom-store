const { Pool } = require("pg");

// const pool = new Pool({
//     user: "bvtnerlu",
//     host: "satao.db.elephantsql.com",
//     database: "bvtnerlu",
//     password: "Oq5jbXifegwkVVoU951jegUofOtDU7Yx",
//     port: 5432,
//     idleTimeoutMillis: 20000,  // number of milliseconds to wait before timing out when connecting a new client
//     connectionTimeoutMillis: 2000
// });

const pool = new Pool({
  user: "postgres",
  host: "192.168.68.120",
  database: "fandom-store",
  password: "04126152",
  port: 5432
});

pool
    .connect()
    .then(() => {
        console.log("Connected Successfully");
        console.log(pool.totalCount);
        console.log(pool.idleCount);
        console.log(pool.waitingCount);
    })
    .catch((e) => {
        console.log(e);
    });

module.exports = {
    query: (text, params) => pool.query(text, params)
};
