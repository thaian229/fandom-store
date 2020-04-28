const express = require("express");
const db = require("../../database");

const postRouter = express.Router();


postRouter.get(`/getItem/:id`, async (req, res) => {
    //Take id from URL
    console.log(req.params.id);
    const prodID = req.params.id;
    //Check product from db
    try {
        const { rows } = await db.query('SELECT * FROM products WHERE id = $1::uuid LIMIT 1', [prodID]);
        if (!rows[0]) {
            res.status(400).json({
                success: false,
                messeage: 'Product not found',
            });
        }
        else {
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
    catch (error) {
        res.status(500).json({
            success: false,
            messeage: error.messeage,
        });
    }
}); //

postRouter.post("/addItem", async (req, res) => { });

postRouter.post("/editItem", async (req, res) => { });

postRouter.post("/removeItem", async (req, res) => { });

postRouter.post("/updateViews", async (req, res) => {
    //get the Item has new view
    const { prod_id } = req.body;
    const { rows } = await db.query(`SELECT views FROM products WHERE id = $1::uuid LIMIT 1`, [prod_id]);
    const newViews = rows[0].views + 1;
    try {
        const TEXT = `
            UPDATE products
            SET views = $1
            WHERE id = $2::uuid
        `
        await db.query(TEXT, [newViews, prod_id])
        res.status(201).json({
            success: true,
            message: 'Update views successfully',
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}); //

postRouter.get("/search/:keyword", async (req, res) => {
    //take keyword from URL
    console.log(req.params.keyword);
    const keyword = req.params.keyword;
    //Check keyword from db
    try {
        const { rows } = await db.query(`SELECT * FROM products WHERE prod_name ILIKE $1::text`, ['%' + keyword + '%']);
        console.log(rows);
        res.status(200).json({
            success: true,
            data: rows
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            messeage: error.messeage,
        });
    }
}); //

postRouter.get("/searchTag/:tag", async (req, res) => {
    //1sp <-> 1 tag
    console.log(req.params.tag);
    const tag = req.params.tag;
    try {
        const { rows } = await db.query(`SELECT prod_name FROM products WHERE tags = $1::text`, [tag]);
        console.log(rows);
        res.status(200).json({
            success: true,
            data: rows
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            messeage: error.messeage,
        });
    }
}); //neu thua thoi gian thi update thanh nhieu category sau.

postRouter.post("/makeComment", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        //take comment from req.body
        const { prod_id, content } = req.body;
        //update into database
        try {
            const TEXT = `
                INSERT INTO comments (acc_id, prod_id, content)
                VALUES ($1::uuid, $2::uuid, $3::text)
            `
            await db.query(TEXT, [userID, prod_id, content])
            res.status(201).json({
                success: true,
                message: 'Submit comment successfully',
            })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
}); //

module.exports = postRouter;
