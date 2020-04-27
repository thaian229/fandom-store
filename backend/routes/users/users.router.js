const express = require("express");
const db = require("../../database");
const bcryptjs = require("bcryptjs");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    // get email and password from req.body
    const { email, password } = req.body;

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
                    await db.query(`INSERT INTO accounts (email, password) VALUES ($1::text, $2::text)`, [email, hashPassword]);
                    const { rows } = await db.query(`SELECT id FROM accounts WHERE email = $1::text LIMIT 1`, [email])
                    await db.query(`INSERT INTO users (acc_id) VALUES ($1::uuid)`, [rows[0].id])
                    await db.query(`INSERT INTO carts (acc_id) VALUES ($1::uuid)`, [rows[0].id])
                    res.status(201).json({
                        success: true,
                        data: {
                            id: rows[0].id,
                            email: email,
                            password: '',
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
        const { rows } = await db.query(`SELECT id, email, password, is_admin FROM accounts WHERE email = $1::text LIMIT 1`, [email])
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
            }

            // response
            res.status(201).json({
                success: true,
                message: 'Login successfully',
                data: {
                    email: rows[0].email,
                    is_admin: rows[0].is_admin,
                },
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

userRouter.get("/logout", async (req, res) => {
    try {
        await req.session.destroy;
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
    console.log(req.session.currentUser)
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        // get all profile related info: full_name, address, dob, email, created_at
        const TEXT = `
            SELECT u.full_name, u.address, u.dob, a.email, a.created_at, a.is_admin
            FROM accounts a JOIN users u ON (a.id = u.acc_id)
            WHERE a.id = $1::uuid
            LIMIT 1
            `
        try {
            const { rows } = await db.query(TEXT, [userID]);
            res.status(201).json({
                success: true,
                data: {
                    full_name: rows[0].full_name,
                    address: rows[0].address,
                    dob: rows[0].dob,
                    email: rows[0].email,
                    created_at: rows[0].created_at,
                },
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
        const { full_name, address, dob } = req.body;
        // save in database
        try {
            const TEXT = `
                UPDATE users
                SET
                    full_name = $1::text,
                    address = $2::text,
                    dob = $3::date
                WHERE
                    acc_id = $4::uuid;
                `
            await db.query(TEXT, [full_name, address, dob, userID])
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
            res.status(201).json({
                success: true,
                message: 'Add to cart successfully',
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
                SELECT ci.id, ci.prod_id, ci.quantity, ci.created_at
                FROM cart_items ci JOIN carts c ON (ci.cart_id = c.id)
                WHERE c.id = $1::uuid
                `
            const { rows } = await db.query(TEXT, [userID]);
            console.table(rows)
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

userRouter.get("/orderHistory", async (req, res) => {
    // check authentication
    if (req.session.currentUser && req.session.currentUser.id) {
        const userID = req.session.currentUser.id;
        // retrieve list of orders 
        try {
            const TEXT = `
                SELECT id FROM orders
                WHERE acc_id = $1::uuid
                `
            const results = await db.query(TEXT, [userID]);
            const orderList = results.rows; // .rows is an array of object each object contain id of the orders
            // take detail of each order
            try {
                let sendBackData = [];
                orderList.forEach(async (item) => {
                    const TEXT = `
                        SELECT prod_id, quantity FROM order_items
                        WHERE oder_items.order_id = $1::uuid
                        `
                    const results = await db.query(TEXT, [item.id]);
                    sendBackData.push({
                        order_id: item.id,
                        order_detail: results.rows,
                    });
                })
                // return data
                res.status(200).json({
                    success: true,
                    data: sendBackData,
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

userRouter.post("/makeOrder", async (req, res) => { });

userRouter.get("/test", async (req, res) => {
    const data = await db.query(`SELECT id, email, is_admin FROM accounts`);
    console.table(data.rows);
    console.log(data.rows);
    res.status(200).json({
        success: true,
        data: data.rows,
    })
});

module.exports = userRouter;