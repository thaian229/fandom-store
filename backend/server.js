const {Pool} = require('pg')
const pool = new Pool({
    user: "bvtnerlu",
    host: "satao.db.elephantsql.com",
    database: "bvtnerlu",
    password: "em-a94IGU_ucyq_I85PWooGB6zHdlZGb",
    port: 5432
  });

pool.connect()
.then(() => console.log("Connected successfully"))
.then(() => pool.query(`SELECT * FROM accounts`))
.then(results => console.table(results.rows))
.catch(e => console.log(e))
.finally(() => pool.end());