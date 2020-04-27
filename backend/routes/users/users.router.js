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
        const { rows } = await db.query(`SELECT id, email, password FROM accounts WHERE email = $1::text LIMIT 1`, [email])
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

userRouter.get("/logout", async (req, res) => {});

userRouter.get("/profile", async (req, res) => {});

userRouter.get("/cart", async (req, res) => {});

userRouter.get("/orderHistory", async (req, res) => {});

userRouter.post("/update", async (req, res) => {});

userRouter.post("/addToCart", async (req, res) => {});
//==>
userRouter.post("/makeOrder", async (req, res) => {});


module.exports = userRouter;
