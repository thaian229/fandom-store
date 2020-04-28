const { Pool } = require("pg");

const pool = new Pool({
  user: "bvtnerlu",
  host: "satao.db.elephantsql.com",
  database: "bvtnerlu",
  password: "Oq5jbXifegwkVVoU951jegUofOtDU7Yx",
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
