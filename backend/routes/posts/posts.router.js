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

postRouter.post("/addItem", async (req, res) => {
    if (req.session.currentUser && req.session.currentUser.id && req.session.currentUser.is_admin) {

        const insertTEXT = `INSERT INTO products(prod_name, price, image_url, description, stock, tags) 
                            VALUES ($1::text, $2, $3::text[], $4::text, $5, $6::text)
                            RETURNING id`;
        const { prod_name, price, image_url, description, stock, tags } = req.body;

        try {
            const new_id_returning = await db.query(insertTEXT, [prod_name, price, image_url, description, stock, tags]);
            const new_id = new_id_returning.rows[0].id;
            res.status(201).json({
                success: true,
                data: {
                    id: new_id
                },
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
});

postRouter.post("/editItem", async (req, res) => {
    if (req.session.currentUser && req.session.currentUser.id && req.session.currentUser.is_admin) {

        const editTEXT = `UPDATE products 
                        SET prod_name=$1::text, price=$2, image_url=$3::text[], description=$4::text, stock=$5, tags=$6::text
                        WHERE id=$7::uuid`;
        const { id, prod_name, price, image_url, description, stock, tags } = req.body;


        try {
            await db.query(editTEXT, [prod_name, price, image_url, description, stock, tags, id]);
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
});

postRouter.post("/removeItem", async (req, res) => {
    if (req.session.currentUser && req.session.currentUser.id && req.session.currentUser.is_admin) {

        const deleteTEXT = `DELETE FROM products WHERE id=$1::uuid`;
        const { id } = req.body;

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
});

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
}); 

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
}); 

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
}); 

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
}); 

module.exports = postRouter;
