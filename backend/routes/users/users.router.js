const express = require("express");
const db = require("../../database");
const bcryptjs = require("bcryptjs");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const telenumRegex = /^\d+$/;

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    // get email and password from req.body
    const { email, password, full_name, tel_num } = req.body;

    // validate email
    if (!email || !emailRegex.test(email)) {
        res.status(400).json({
            success: false,
            message: 'Invalid email address',
        });
    } else if (!password || password.length < 6) { // validate password
        res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters',
        });
    } else if (!telenumRegex.test(tel_num)) {
        res.status(400).json({
            success: false,
            message: 'Invalue telephone number',
        });
    } else {
        // check weather email exist or not
        try {
            const { rows } = await db.query(`SELECT email FROM accounts WHERE email = $1::text LIMIT 1`, [email])
            if (rows[0]) {
                res.status(400).json({
                    success: false,
                    message: 'This email has been used',
                });
            } else {
                // hash password
                const hashPassword = bcryptjs.hashSync(password, 10);

                // save to database
                try {
                    const TEXT = `
                        INSERT INTO accounts (email, password, full_name, tel_num)
                        VALUES
                            ($1::text, $2::text, $3::text, $4::text)
                        RETURNING
                            id
                        `
                    const { rows } = await db.query(TEXT, [email, hashPassword, full_name, tel_num]);
                    await db.query(`INSERT INTO carts (acc_id) VALUES ($1::uuid)`, [rows[0].id])
                    res.status(201).json({
                        success: true,
                        data: {
                            id: rows[0].id,
                            email: email,
                        },
                    });
                } catch (e) { // error on INSERT INTO
                    res.status(500).json({
                        success: false,
                        message: e.message,
                    });
                }
            }
        } catch (err) { // error on SELECT email
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
});

userRouter.post("/login", async (req, res) => {
    // get email and password from req.body
    const { email, password } = req.body;

    // check email existance
    try {
        const TEXT = `
            SELECT id, email, password, is_admin, ava_url, full_name
            FROM accounts 
            WHERE email = $1::text LIMIT 1
            `
        const { rows } = await db.query(TEXT, [email])
        if (!rows[0]) {
            res.status(400).json({
                success: false,
                message: 'This email does not exist',
            });
        } else if (!bcryptjs.compareSync(password, rows[0].password)) {
            res.status(400).json({
                success: false,
                message: 'Wrong password',
            });
        } else {
            // save info to session storage
            req.session.currentUser = {
                id: rows[0].id,
                email: rows[0].email,
                is_admin: rows[0].is_admin,
                ava_url: rows[0].ava_url,
                full_name: rows[0].full_name,
            };

            // response
            res.status(201).json({
                success: true,
                message: 'Login successfully',
                data: {
                    email: rows[0].email,
                    is_admin: rows[0].is_admin,
                    id: rows[0].id,
                    ava_url: rows[0].ava_url,
                    full_name: rows[0].full_name,
                },
            });
            req.session.cookie.expires = false;
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
    // console.log(req.headers.cookie);

});

userRouter.post("/restoreSession", async (req, res) => {
    // get id, email, is_admin
    const { id, email, is_admin, ava_url, full_name } = req.body;
    try {
        req.session.currentUser = {
            id: id,
            email: email,
            is_admin: is_admin,
            ava_url: ava_url,
            full_name: full_name,
        }
        req.session.cookie.expires = false;
        res.status(201).json({
            success: true,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
        })
    }
})

userRouter.get("/logout", async (req, res) => {
    try {
        await req.session.destroy();
        res.status(200).json({
            success: true,
            message: 'Logout successfully',
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

userRouter.get("/profile", async (req, res) => {
    // check weather login? 
    // console.log(req.session.currentUser)
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        // get all profile related info: full_name, address, dob, email, created_at
        const TEXT = `
            SELECT email, full_name, tel_num, address, dob, cart_qty, ava_url, created_at
            FROM accounts
            WHERE id = $1::uuid
            `
        try {
            const { rows } = await db.query(TEXT, [userID]);
            res.status(201).json({
                success: true,
                data: rows[0],
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
});

userRouter.post("/update", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        // take info from req.body
        const { full_name, tel_num, address, dob, ava_url } = req.body;
        // save in database
        try {
            const TEXT = `
                UPDATE accounts
                SET
                    full_name = $1::text,
                    tel_num = $2::text,
                    address = $3::text,
                    dob = $4::date,
                    ava_url = $5::text
                WHERE
                    id = $6::uuid;
                `
            await db.query(TEXT, [full_name, tel_num, address, dob, ava_url, userID])
            res.status(201).json({
                success: true,
                message: 'Update successfully',
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
});

userRouter.post("/addToCart", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        // take prod_id, quantity from req.body
        const { prod_id, quantity } = req.body;
        const { rows } = await db.query(`SELECT id FROM carts WHERE acc_id = $1::uuid`, [userID]);
        const cart_id = rows[0].id;
        // update into database
        try {
            const TEXT = `
                INSERT INTO cart_items (prod_id, quantity, cart_id)
                VALUES
                    ($1::uuid, $2, $3::uuid)
                `
            await db.query(TEXT, [prod_id, quantity, cart_id])
            const TEXT_UPDATE_CART_QTY = `
                UPDATE accounts
                SET cart_qty = cart_qty + 1
                WHERE id = $1::uuid
                RETURNING cart_qty
            `
            const cart_qty_return = await db.query(TEXT_UPDATE_CART_QTY, [userID])
            res.status(201).json({
                success: true,
                message: 'Add to cart successfully',
                cart_qty: cart_qty_return.rows[0].cart_qty,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
});

userRouter.get("/cart", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        const { rows } = await db.query(`SELECT id FROM carts WHERE acc_id = $1::uuid`, [userID]);
        const cart_id = rows[0].id;
        // query and sent data
        try {
            const TEXT = `
                SELECT ci.id, p.prod_name, ci.prod_id , ci.quantity, p.price
                FROM
                    cart_items ci JOIN products p ON (ci.prod_id = p.id)
                WHERE ci.cart_id = $1::uuid
                `
            const { rows } = await db.query(TEXT, [cart_id]);
            // console.table(rows)
            res.status(200).json({
                success: true,
                cart_id: cart_id,
                data: rows,
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
});

userRouter.post("/removeFromCart", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        // take prod_id, quantity from req.body
        const { cart_items_id } = req.body;
        // update into database
        try {
            const TEXT = `
                DELETE FROM cart_items
                WHERE id = $1::uuid
                `
            await db.query(TEXT, [cart_items_id])
            const TEXT_UPDATE_CART_QTY = `
                UPDATE accounts
                SET cart_qty = cart_qty - 1
                WHERE id = $1::uuid
                RETURNING cart_qty
            `
            const cart_qty_return = await db.query(TEXT_UPDATE_CART_QTY, [userID])
            res.status(201).json({
                success: true,
                message: 'Add to cart successfully',
                cart_qty: cart_qty_return.rows[0].cart_qty,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
});

userRouter.post("/clearCart", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        const { rows } = await db.query(`SELECT id FROM carts WHERE acc_id = $1::uuid`, [userID]);
        const cart_id = rows[0].id;
        // update into database
        try {
            const TEXT = `
                DELETE FROM cart_items
                WHERE cart_id = $1::uuid
                `
            await db.query(TEXT, [cart_id])
            const TEXT_UPDATE_CART_QTY = `
                UPDATE accounts
                SET cart_qty = 0
                WHERE id = $1::uuid
                RETURNING cart_qty
            `
            const cart_qty_return = await db.query(TEXT_UPDATE_CART_QTY, [userID])
            res.status(201).json({
                success: true,
                message: 'Cart Cleared',
                cart_qty: cart_qty_return.rows[0].cart_qty,
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
});

userRouter.get("/orderHistory", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        // retrieve list of orders 
        try {
            const TEXT = `
                SELECT id, created_at FROM orders
                WHERE acc_id = $1::uuid
                ORDER BY created_at DESC
                `
            const results = await db.query(TEXT, [userID]);
            const orderList = results.rows; // .rows is an array of object each object contain id of the orders
            // console.log(1)
            // console.log(orderList)
            // take detail of each order
            try {
                let sendBackData = [];
                var itemDone = 0;
                orderList.forEach(async (item) => {
                    const TEXT = `
                        SELECT oi.prod_id, oi.quantity, p.prod_name, p.price 
                        FROM order_items oi JOIN products p ON (oi.prod_id = p.id)
                        WHERE oi.order_id = $1::uuid
                        `;
                    const results = await db.query(TEXT, [item.id]);
                    // console.log(2);
                    // console.log(results);
                    sendBackData.push({
                        order_id: item.id,
                        created_at: item.created_at,
                        order_detail: results.rows,
                    });
                    itemDone++
                    // console.log(3);
                    // console.log(sendBackData);
                    if (itemDone === orderList.length) {
                        // return data
                        // console.log(4)
                        // console.log(sendBackData)
                        res.status(200).json({
                            success: true,
                            data: sendBackData,
                        })
                    }
                })
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
});

userRouter.post("/makeOrder", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        // take user and cart id
        const userID = req.session.currentUser.id;
        // take list of product
        const TEXT = `
                SELECT  ci.prod_id, ci.quantity
                FROM cart_items ci JOIN carts c ON (ci.cart_id = c.id)
                WHERE c.acc_id = $1::uuid
                `
        const { rows } = await db.query(TEXT, [userID]);
        // make new order
        try {
            const order_id_returning = await db.query(`INSERT INTO orders (acc_id) VALUES ($1::uuid) RETURNING id`, [userID])
            const order_id = order_id_returning.rows[0].id;
            // console.log(order_id)
            // make list of order items
            try {
                const TEXT_ORDER_ITEM = `
                    INSERT INTO order_items (order_id, prod_id, quantity)
                    VALUES
                        ($1::uuid, $2::uuid, $3)
                `
                const TEXT_UPDATE_PROD = `
                    UPDATE products
                    SET stock = stock - $1,
                        sold = sold + $1
                    WHERE id = $2::uuid
                `
                rows.forEach(async (item) => {
                    try {
                        // console.log(item)
                        await db.query(TEXT_ORDER_ITEM, [order_id, item.prod_id, item.quantity]);
                    } catch (e1) {
                        console.log(e1)
                    }
                })
                rows.forEach(async (item1) => {
                    try {
                        // console.log(item)
                        await db.query(TEXT_UPDATE_PROD, [item1.quantity, item1.prod_id]);
                    } catch (e2) {
                        console.log(e2)
                    }
                })
                res.status(201).json({
                    success: true,
                    message: 'Make order successfully',
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            }
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    } else {
        res.status(403).json({
            success: false,
            message: 'Unauthenticated, access denied',
        });
    }
});

userRouter.get("/test", async (req, res) => {
    const data = await db.query(`SELECT id, email, is_admin FROM accounts`);
    console.table(data.rows);
    console.log(data.rows);
    res.status(200).json({
        success: true,
        data: data.rows,
    })
});

userRouter.get("/checkAdmin", async (req, res) => {
    // check weather login? 
    console.log(req.session)
    if (req.session.currentUser.email && req.session.currentUser.id) {
        try {
            res.status(201).json({
                success: true,
                data: {
                    is_admin: req.session.currentUser.is_admin
                },    
            })
        } catch (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }  
});

module.exports = userRouter;