const express = require("express");
const db = require("../../database");
const bcryptjs = require("bcryptjs");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userRouter = express.Router();

userRouter.get("/getAll", async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM accounts");
    console.table(data.rows);
    res.status(201).json({
      success: true,
      message: "success",
      data: data.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err,
      data: data.rows,
    });
  }
});

userRouter.get("/getid/:id", async (req, res) => {
  try {
    data = await db.query("SELECT * FROM accounts WHERE id=$1", [
      req.params.id,
    ]);
    console.table(data.rows);
    res.status(201).json({
      success: true,
      message: "success",
      data: data.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err,
      data: data.rows,
    });
  }
});

module.exports = userRouter;
