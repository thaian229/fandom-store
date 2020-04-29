const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "fandom_store",
  password: "22114455",
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
