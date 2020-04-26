const express = require('express');
const db = require('../../database');
const multer = require('multer');
const fs = require('fs');
var path = require('path');
var Jimp = require('jimp');

const uploadRouter = express.Router();

const uploadProductImg = multer({
    dest: 'public/productImg'
});
const uploadAvatar = multer({
    dest: 'public/avatar'
});
const uploadThumbnail = multer({
    dest: 'public/thumbnail'
});


// userRouter.get("/getAll", async (req, res) => {
//   try {
//     const data = await db.query("SELECT * FROM accounts");
//     console.table(data.rows);
//     res.status(201).json({
//       success: true,
//       message: "success",
//       data: data.rows,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: err,
//       data: data.rows,
//     });
//   }
// });

uploadRouter.post("/post/productImg", uploadProductImg.array('image') , async (req, res) => {});

uploadRouter.get("/get/productImg/:filename", async (req, res) => {});

uploadRouter.post("/post/avatar", uploadAvatar.single('image'), async (req, res) => {});

uploadRouter.get("/get/avatar/:filename", async (req, res) => {});

uploadRouter.post("/post/thumbnail", uploadThumbnail.single('image'), async (req, res) => {});

uploadRouter.get("/get/thumbnail/:filename", async (req, res) => {});


module.exports = uploadRouter;

