const express = require("express");
const db = require("../../database");

const postRouter = express.Router();

postRouter.get(`/getItem/:id`, async (req, res) => {
    //Take id from URL
    // console.log(req.params.id);
    const prodID = req.params.id;

    const TEXT = 'SELECT * FROM products WHERE id = $1::uuid LIMIT 1'
    //Check product from db
    try {
        const { rows } = await db.query(TEXT, [prodID]);
        if (!rows[0]) {
            res.status(404).json({
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
                    tags: rows[0].tags,
                },
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            messeage: error,
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

        const deleteTEXT = `
            DELETE FROM products CASCADE
            WHERE id=$1::uuid
            `;
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
                message: e.message
            })
        }

    } else {
        res.status(403).json({
            success: false,
            message: "Unauthenticated, access denied"
        })
    }
});

postRouter.get("/getPagination", async (req, res) => {
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    if (isNaN(pageNumber) || isNaN(pageSize)) {
        res.status(500).json({
            success: false,
            message: 'pageNumber && pageSize is invalid',
        })
    } else if (pageNumber < 1 || pageSize < 1 || pageSize > 40) {
        res.status(500).json({
            success: false,
            message: 'pageNumber && pageSize is invalid',
        })
    } else {
        try {
            const TEXT = `
                    SELECT * 
                    FROM products
                    OFFSET $1
                    LIMIT $2
                `
            const { rows } = await db.query(TEXT, [((pageNumber - 1) * pageSize), pageSize]);
            res.status(201).json({
                success: true,
                data: rows,
            })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }
    }

});

postRouter.get("/getRecommended", async (req, res) => {
    const pageSize = 4;
    const tag = String(req.query.tag);

    if (isNaN(pageSize)) {
        res.status(500).json({
            success: false,
            message: 'pageSize is invalid',
        })
    } else if (pageSize < 1 || pageSize > 40) {
        res.status(500).json({
            success: false,
            message: 'pageSize is invalid',
        })
    } else {
        try {
            const TEXT = `
                    SELECT * 
                    FROM products
                    WHERE tags ILIKE $1::text
                    LIMIT $2
                  `
            const { rows } = await db.query(TEXT, [tag, pageSize]);
            res.status(201).json({
                success: true,
                data: rows,
            })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }
    }

});

postRouter.get("/searchPopular", async (req, res) => {
    const pageSize = Number(req.query.pageSize);
    const searchValue = String(req.query.searchValue);

    if (isNaN(pageSize)) {
        res.status(500).json({
            success: false,
            message: 'pageSize is invalid',
        })
    } else if (pageSize < 1 || pageSize > 40) {
        res.status(500).json({
            success: false,
            message: 'pageSize is invalid',
        })
    } else {
        try {
            const TEXT = `
                    SELECT * 
                    FROM products
                    WHERE prod_name ILIKE $1::text
                    ORDER BY sold DESC
                    LIMIT $2
                `
            const { rows } = await db.query(TEXT, ['%' + searchValue + '%', pageSize]);
            res.status(201).json({
                success: true,
                data: rows,
            })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }
    }

});

postRouter.get("/searchPagination", async (req, res) => {
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const searchValue = String(req.query.searchValue);

    if (isNaN(pageNumber) || isNaN(pageSize)) {
        res.status(500).json({
            success: false,
            message: 'pageNumber && pageSize is invalid',
        })
    } else if (pageNumber < 1 || pageSize < 1 || pageSize > 40) {
        res.status(500).json({
            success: false,
            message: 'pageNumber && pageSize is invalid',
        })
    } else {
        try {
            const TEXT = `
                    SELECT * 
                    FROM products
                    WHERE prod_name ILIKE $1::text
                    OFFSET $2
                    LIMIT $3
                `
            const { rows } = await db.query(TEXT, ['%' + searchValue + '%', ((pageNumber - 1) * pageSize), pageSize]);
            res.status(201).json({
                success: true,
                data: rows,
            })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }
    }

});

postRouter.get("/category", async (req, res) => {
    const pageNumber = Number(req.query.pageNumber);
    const pageSize = Number(req.query.pageSize);
    const tag = String(req.query.tag);

    if (isNaN(pageNumber) || isNaN(pageSize)) {
        res.status(500).json({
            success: false,
            message: 'pageNumber && pageSize is invalid',
        })
    } else if (pageNumber < 1 || pageSize < 1 || pageSize > 40) {
        res.status(500).json({
            success: false,
            message: 'pageNumber && pageSize is invalid',
        })
    } else {
        try {
            const TEXT = `
                    SELECT * 
                    FROM products
                    WHERE tags ILIKE $1::text
                    OFFSET $2
                    LIMIT $3
                `
            const { rows } = await db.query(TEXT, [tag, ((pageNumber - 1) * pageSize), pageSize]);
            res.status(201).json({
                success: true,
                data: rows,
            })
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }
    }

});

postRouter.post("/updateViews", async (req, res) => {
    //get the Item has new view
    const { prod_id } = req.body;
    const TEXT = `
            UPDATE products
            SET views = views + 1
            WHERE id = $1::uuid
        `
    try {
        await db.query(TEXT, [prod_id])
        res.status(201).json({
            success: true,
            message: 'Update views successfully',
        })
    }

    catch (error) {
        res.status(500).json({
            success: false,
            message: error,
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
                message: error,
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

postRouter.get("/getAllComment/:prodid", async (req, res) => {
    const prodid = req.params.prodid;
    // console.log(prodid)
    try {
        const TEXT = `
                SELECT a.id, a.full_name, a.ava_url, a.email, a.is_admin, c.created_at, c.content  
                FROM comments c
                JOIN accounts a
                ON c.acc_id = a.id
                WHERE c.prod_id = $1::uuid
            `
        const { rows } = await db.query(TEXT, [prodid]);
        res.status(201).json({
            success: true,
            data: rows,
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
});

module.exports = postRouter;
