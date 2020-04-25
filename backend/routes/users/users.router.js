const express = require('express');
const db = require('../../database');
const bcryptjs = require('bcryptjs');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const userRouter = express.Router();

userRouter.get('/getAll', async (req, res) => {
    const data = await db.query('SELECT * FROM accounts', [], (err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            })
        } else {
            console.table(result.rows)
            res.status(201).json({
                success: true,
                message: 'success',
                data: result.rows
            })
        }
    })

})

userRouter.get('/getid/:id', async (req, res) => {
    const data = await db.query('SELECT * FROM accounts WHERE id=$1', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({
                success: false,
                message: err.message,
            })
        } else {
            console.table(result.rows[0])
            res.status(201).json({
                success: true,
                message: 'success',
                data: result.rows
            })
        }
    })



})


module.exports = userRouter;

