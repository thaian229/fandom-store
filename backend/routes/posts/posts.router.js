const express = require("express");
const db = require("../../database");

const postRouter = express.Router();


postRouter.get("/getItem/:id", async (req, res) => { }); //

postRouter.post("/addItem", async (req, res) => {
    if (req.session.currentUser && req.session.currentUser.id) {

        const userID = req.session.currentUser.id;
        const TEXT = `SELECT is_admin FROM accounts WHERE id=$1::uuid`;
        const insertTEXT = `INSERT INTO products(prod_name, price, image_url, description, stock, tags) 
                            VALUES ($1::text, $2, $3::text[], $4::text, $5, $6::text)`;
        const { prod_name, price, image_url, description, stock, tags } = req.body;

        try {
            const { rows } = await db.query(TEXT, [userID]);
            if (rows[0].is_admin) {
                try {
                    await db.query(insertTEXT, [prod_name, price, image_url, description, stock, tags]);
                    res.status(201).json({
                        success: true,
                        message: "new item added successfully"
                    })
                }
                catch (e) {
                    res.status(500).json({
                        success: false,
                        message: e
                    })
                    console.log(e);
                }
            } else {
                res.status(403).json({
                    success: false,
                    message: "Unauthenticated, access denied"
                })
            }
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err
            })
            console.log(err);
        }
    } else {
        res.status(403).json({
            success: false,
            message: "Unauthenticated, access denied"
        })
    }
});

postRouter.post("/editItem", async (req, res) => {
    if (req.session.currentUser && req.session.currentUser.id) {

        const userID = req.session.currentUser.id;
        const TEXT = `SELECT is_admin FROM accounts WHERE id=$1::uuid`;
        const editTEXT = `UPDATE products 
                        SET prod_name=$1::text, price=$2, image_url=$3::text[], description=$4::text, stock=$5, tags=$6::text`;
        const { prod_name, price, image_url, description, stock, tags } = req.body;

        try {
            const { rows } = await db.query(TEXT, [userID]);
            if (rows[0].is_admin) {
                try {
                    await db.query(editTEXT, [prod_name, price, image_url, description, stock, tags]);
                    res.status(201).json({
                        success: true,
                        message: "item edited"
                    })
                }
                catch (e) {
                    res.status(500).json({
                        success: false,
                        message: e
                    })
                }
            } else {
                res.status(403).json({
                    success: false,
                    message: "Unauthenticated, access denied"
                })
            }
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err
            })
        }
    } else {
        res.status(403).json({
            success: false,
            message: "Unauthenticated, access denied"
        })
    }
});

postRouter.post("/removeItem", async (req, res) => {
    if (req.session.currentUser && req.session.currentUser.id) {

        const userID = req.session.currentUser.id;
        const TEXT = `SELECT is_admin FROM accounts WHERE id=$1::uuid`;
        const deletedeleteTEXT = `DELETE FROM products WHERE id=$1::uuid`;
        const { id } = req.body;

        try {
            const { rows } = await db.query(TEXT, [userID]);
            if (rows[0].is_admin) {
                try {
                    await db.query(deleteTEXT, [id]);
                    res.status(201).json({
                        success: true,
                        message: "item deleted"
                    })
                }
                catch (e) {
                    res.status(500).json({
                        success: false,
                        message: e
                    })
                }
            } else {
                res.status(403).json({
                    success: false,
                    message: "Unauthenticated, access denied"
                })
            }
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err
            })
        }
    } else {
        res.status(403).json({
            success: false,
            message: "Unauthenticated, access denied"
        })
    }
});

postRouter.post("/updateViews", async (req, res) => { }); //

postRouter.get("/search/:keyword", async (req, res) => { }); //

postRouter.get("/search/:tags", async (req, res) => {
    //1sp <-> 1 tags
}); //neu thua thoi gian thi update thanh nhieu category sau.

postRouter.post("/makeComment", async (req, res) => {}); //

module.exports = postRouter;
