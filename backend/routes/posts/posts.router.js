const express = require("express");
const db = require("../../database");

const postRouter = express.Router();


postRouter.get(`/getItem/:id`, async (req, res) => {
    //Take id from URL
    console.log(req.params.id);
    const prodID = req.params.id;
    //Check product from db
    try{
        const {rows} = await db.query('SELECT id, prod_name, price, image_url, created_at, description, views, stock, sold, tag FROM products WHERE id = $1::uuid LIMIT 1', [prodID]);
        if(!rows[0].id){
            res.status(400).json({
                success: false,
                messeage: 'Product not found',
            });
        }
        else{
            res.status(201).json({
                success: true,
                data: {
                    prod_name: rows[0].prod_name, 
                    price: rows[0].price, 
                    image_url: rows[0].image_url, 
                    created_at: rows[0].created_at, 
                    description: rows[0].description, 
                    views: rows[0].views, 
                    stock: rows[0].stock, 
                    sold: rows[0].sold, 
                    tag: rows[0].tag,
                },
            });
        }
    }
    catch(error){
        res.status(500).json({
            success: false,
            messeage: error.messeage,
        });
    }
}); //

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
