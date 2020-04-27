const express = require("express");
const db = require("../../database");

const postRouter = express.Router();


postRouter.get(`/getItem/:id`, async (req, res) => {
    //Take id from URL
    console.log(req.param.id);
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

postRouter.post("/addItem", async (req, res) => {
    // check authentication
    if(req.session.currentUser && req.session.currentUser.id){
        const userID = req.session.currentUser.id;
        const {rows} = await db.query(`SELECT is_admin FROM accounts as a WHERE a.id = $1::uuid`,[userID]);
        //Check admin
        if(rows[0].is_admin){
            //take new product information from req.body
            const {id, prod_name, price, image_url, created_at, description, stock, tag} = req.body;
            try {
                const TEXT = `
                    INSERT INTO products (id, prod_name, price, image_url, created_at, description, stock, tag)
                    VALUES
                        ($1::uuid, $2::text, $3, $4::text, $5::time, $6::text, $7, $8::text)
                    `
                await db.query(TEXT,[id, prod_name, price, image_url, created_at, description, stock, tag])
                res.status(201).json({
                    success: true,
                    message: 'Add product successfully',
                });
            }
            catch(error){
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        }
        // If not admin
        else{
            res.status(403).json({
                success: false,
                message: 'Only admin',
            });
        }
    }
    else{
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
}); 

postRouter.post("/editItem", async (req, res) => {}); 

postRouter.post("/removeItem", async (req, res) => {}); 

postRouter.post("/updateViews", async (req, res) => {}); //

postRouter.get("/search/:keyword", async (req, res) => {}); //

postRouter.get("/search/:tag", async (req, res) => {
    //1sp <-> 1 tag
}); //neu thua thoi gian thi update thanh nhieu category sau.

postRouter.post("/makeComment", async (req, res) => {}); //

module.exports = postRouter;