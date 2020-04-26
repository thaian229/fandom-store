const express = require("express");
const db = require("../../database");

const postRouter = express.Router();


postRouter.get("/getItem/:id", async (req, res) => {}); //

postRouter.post("/addItem", async (req, res) => {}); 

postRouter.post("/editItem", async (req, res) => {}); 

postRouter.post("/removeItem", async (req, res) => {}); 

postRouter.post("/updateViews", async (req, res) => {}); //

postRouter.get("/search/:keyword", async (req, res) => {}); //

postRouter.get("/search/:tag", async (req, res) => {
    //1sp <-> 1 tag
}); //neu thua thoi gian thi update thanh nhieu category sau.

postRouter.post("/makeComment", async (req, res) => {}); //

module.exports = postRouter;
