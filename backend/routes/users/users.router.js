const express = require("express");
const db = require("../../database");
const bcryptjs = require("bcryptjs");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userRouter = express.Router();

userRouter.get("/register", async (req, res) => {});

userRouter.get("/login", async (req, res) => {});

userRouter.get("/logout", async (req, res) => {});

userRouter.get("/profile", async (req, res) => {});

userRouter.get("/cart", async (req, res) => {});

userRouter.get("/orderHistory", async (req, res) => {});

userRouter.post("/update", async (req, res) => {});

userRouter.post("/addToCart", async (req, res) => {});
//==>
userRouter.post("/makeOrder", async (req, res) => {});


module.exports = userRouter;
