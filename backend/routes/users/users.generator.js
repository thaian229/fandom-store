const express = require("express");
const db = require("../../database");
const bcryptjs = require("bcryptjs");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const telenumRegex = /^\d+$/;

const userGenerator = express.Router();

userGenerator.get("/register", async (req, res) => {
    // get email and password from req.body
    for (let i = 2; i <= 99; i++) {
        let email = "user" + i + "@gmail.com"
        let password = "123456"
        let full_name = "user " + i
        let tel_num = "09040000" + i


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
    }
    res.status(201).json({
        success: true,
    });
});

module.exports = userGenerator;