const express = require("express");
const db = require("../../database");
const multer = require("multer");
const fs = require("fs");
var path = require("path");
var Jimp = require("jimp");

const uploadRouter = express.Router();

const uploadProductImg = multer({
	dest: "public/productImg",
});
const uploadAvatar = multer({
	dest: "public/avatar",
});
const uploadThumbnail = multer({
	dest: "public/thumbnail",
});

uploadRouter.post("/post/productImg", uploadProductImg.array("image", 4), async (req, res) => {

	console.log(req.files);
	let imgUrls = [];

	await (req.files.forEach(async file => {
		//the original format
		let format = await file.originalname.split(".")[file.originalname.split(".").length - 1];
		// new file name with format
		let fixedName = `${file.filename}.${format}`;

		try {
			fs.renameSync(`public/productImg/${file.filename}`, `public/productImg/${fixedName}`);
			imgUrls.push(`http://localhost:3001/upload/productImg/${fixedName}`)
			const data = await Jimp.read(`public/productImg/${fixedName}`);
			data.resize(1080, Jimp.AUTO) // resize
				.quality(100) // set JPEG quality
				.write(`public/productImg/${fixedName}`); // save
		}
		catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			});
		}
	}));

	res.status(200).json({
		success: true,
		imgUrls: imgUrls
	});
});

uploadRouter.get("/get/productImg/:filename", async (req, res) => {
	res.sendFile(path.resolve(`public/productImg/${req.params.filename}`));
});

uploadRouter.post("/post/avatar", uploadAvatar.single("image"), async (req, res) => {

	console.log(req.file)

	//the original format
	let format = await req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
	// new file name with format
	let fixedName = `${req.file.filename}.${format}`;

	try {
		fs.renameSync(`public/avatar/${req.file.filename}`, `public/avatar/${fixedName}`);
		const data = await Jimp.read(`public/avatar/${fixedName}`);
		data.resize(200, Jimp.AUTO) // resize
			.quality(100) // set JPEG quality
			.write(`public/avatar/${fixedName}`); // save
		res.status(200).json({
			success: true,
			imgUrl: `http://localhost:3001/upload/avatar/${fixedName}`
		});
	}
	catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

uploadRouter.get("/get/avatar/:filename", async (req, res) => {
	res.sendFile(path.resolve(`public/avatar/${req.params.filename}`));
});

uploadRouter.post("/post/thumbnail", uploadThumbnail.single("image"), async (req, res) => {

	console.log(req.file)

	//the original format
	let format = await req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
	// new file name with format
	let fixedName = `${req.file.filename}.${format}`;

	try {
		fs.renameSync(`public/thumbnail/${req.file.filename}`, `public/thumbnail/${fixedName}`);
		const data = await Jimp.read(`public/thumbnail/${fixedName}`);
		data.resize(200, Jimp.AUTO) // resize
			.quality(100) // set JPEG quality
			.write(`public/thumbnail/${fixedName}`); // save
		res.status(200).json({
			success: true,
			imgUrl: `http://localhost:3001/upload/thumbnail/${fixedName}`
		});
	}
	catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
});

uploadRouter.get("/get/thumbnail/:filename", async (req, res) => {
	res.sendFile(path.resolve(`public/thumbnail/${req.params.filename}`));
});

module.exports = uploadRouter;
