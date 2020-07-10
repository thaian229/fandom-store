const express = require("express");
const db = require("../../database");

const statRouter = express.Router();

statRouter.get(`/getFirstRow`, async (req, res) => {
    const TEXT = `
    SELECT t1.total_sale, t2.this_month_sale, t3.user_number
    FROM(
        SELECT SUM(o.total_price) as total_sale
	    FROM orders o
    ) t1
    JOIN(
        SELECT SUM(o.total_price) as this_month_sale
	    FROM orders o 
	    WHERE EXTRACT(month from created_at at TIME ZONE 'Asia/Ho_Chi_Minh') = EXTRACT(month from NOW() at TIME ZONE 'Asia/Ho_Chi_Minh')
    ) t2
    ON 1 = 1
    JOIN(
        SELECT COUNT(a.id) as user_number
        FROM accounts a
        WHERE a.is_admin = false
    ) t3
    ON 1 = 1
    `;
    try {
        const { rows } = await db.query(TEXT);
        if (!rows[0]) {
            res.status(404).json({
                success: false,
                messeage: 'NOTFOUND',
            });
        }
        else {
            res.status(201).json({
                success: true,
                data: {
                    total_sale: rows[0].total_sale,
                    this_month_sale: rows[0].this_month_sale,
                    user_number: rows[0].user_number,
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
});

statRouter.get(`/getColChart`, async (req, res) => {
    const TEXTM = `
        SELECT SUM(o.total_price) as QM, FLOOR((EXTRACT(month from o.created_at at TIME ZONE 'Asia/Ho_Chi_Minh') +2 )/3 ) as quaterM
        FROM orders o
        GROUP BY FLOOR((EXTRACT(month from o.created_at at TIME ZONE 'Asia/Ho_Chi_Minh') +2 )/3)
    `;
    const TEXT = `
        SELECT SUM(oi.quantity) as Q, FLOOR((EXTRACT(month from oi.created_at at TIME ZONE 'Asia/Ho_Chi_Minh') +2 )/3 ) as quater
        FROM order_items oi
        GROUP BY FLOOR((EXTRACT(month from oi.created_at at TIME ZONE 'Asia/Ho_Chi_Minh') +2 )/3)
    `
    try {
        const p = await db.query(TEXT);
        const m = await db.query(TEXTM);
        if (!p.rows[0] || !m.rows[0]) {
            res.status(201).json({
                success: true,
                data: {
                    product_data: [0, 0, 0, 0],
                    revenue_data: [0, 0, 0, 0]
                },
            });
        }
        else {
            const dataProduct = [0, 0, 0, 0];
            const dataRevenue = [0, 0, 0, 0];
            p.rows.forEach(element => {
                dataProduct[element.quater - 1] = element.q;
            });
            m.rows.forEach(element => {
                dataRevenue[element.quaterm - 1] = element.qm;
            });
            res.status(201).json({
                success: true,
                data: {
                    product_data: dataProduct,
                    revenue_data: dataRevenue
                },
            });
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            messeage: error,
        });
    }
});

statRouter.get(`/getConversionRate`, async (req, res) => {
    const TEXT = `
        SELECT t1.total_sold, t2.total_views 
        FROM (SELECT SUM(p.sold) as total_sold FROM products p) t1
        JOIN (SELECT SUM(p.views) as total_views FROM products p) t2
        ON 1=1
    `;
    try {
        const { rows } = await db.query(TEXT);
        if (!rows[0]) {
            res.status(404).json({
                success: false,
                messeage: 'NOT FOUND',
            });
        }
        else {
            res.status(201).json({
                success: true,
                data: {
                    total_sold: rows[0].total_sold,
                    total_views: rows[0].total_views
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
});

statRouter.get(`/getDonut`, async (req, res) => {

    const TEXT = `
        SELECT SUM(t1.sum), t1.tags, t2.total
        FROM (
            SELECT SUM(oi.quantity), p.tags
            FROM order_items oi
            INNER JOIN products p ON p.id = oi.prod_id
            GROUP BY (oi.prod_id), p.tags
            ORDER BY SUM(oi.quantity) DESC
        ) t1
        JOIN (
            SELECT SUM(oi.quantity) as total
            FROM order_items oi
        ) t2
        ON 1=1
        GROUP BY t1.tags, t2.total
        LIMIT 5
    `;
    const TEXTK = `
        SELECT SUM(t1.sum), t1.tags, t2.k_total
        FROM (
            SELECT SUM(oi.quantity), p.tags
            FROM order_items oi
            INNER JOIN products p ON p.id = oi.prod_id
            GROUP BY (oi.prod_id), p.tags
            HAVING p.tags ILIKE 'K-%'
            ORDER BY SUM(oi.quantity) DESC
        ) t1
        JOIN (
            SELECT SUM(oi.quantity) as k_total
            FROM order_items oi
            INNER JOIN products p ON p.id = oi.prod_id
            WHERE p.tags ILIKE 'K-%'
            ORDER BY SUM(oi.quantity) DESC
        ) t2
        ON 1=1
        GROUP BY t1.tags, t2.k_total
        LIMIT 4
    `
    const TEXTJ = `
        SELECT SUM(t1.sum), t1.tags, t2.j_total
        FROM (
            SELECT SUM(oi.quantity), p.tags
            FROM order_items oi
            INNER JOIN products p ON p.id = oi.prod_id
            GROUP BY (oi.prod_id), p.tags
            HAVING p.tags ILIKE 'J-%'
            ORDER BY SUM(oi.quantity) DESC
        ) t1
        JOIN (
            SELECT SUM(oi.quantity) as j_total
            FROM order_items oi
            INNER JOIN products p ON p.id = oi.prod_id
            WHERE p.tags ILIKE 'J-%'
            ORDER BY SUM(oi.quantity) DESC
        ) t2
        ON 1=1
        GROUP BY t1.tags, t2.j_total
        LIMIT 4
    `
    try {
        const a = await db.query(TEXT);
        const k = await db.query(TEXTK);
        const j = await db.query(TEXTJ);
        res.status(201).json({
            success: true,
            data: {
                a_data: a.rows,
                k_data: k.rows,
                j_data: j.rows
            },
        });
        // }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            messeage: error,
        });
    }
});

statRouter.get(`/ranking`, async (req, res) => {
    const TEXTV = `
        SELECT p.prod_name, p.id, p.views
        FROM products p
        ORDER BY p.views DESC
        LIMIT 10
    `;
    const TEXTS = `
        SELECT p.prod_name, p.id, p.sold
        FROM products p
        ORDER BY p.sold DESC
        LIMIT 10
    `;
    try {
        const v = await db.query(TEXTV);
        const s = await db.query(TEXTS);
        if (!v.rows[0] || !s.rows[0]) {
            res.status(404).json({
                success: false,
                messeage: 'NOT FOUND',
            });
        }
        else {
            res.status(201).json({
                success: true,
                data: {
                    viewRanking: v.rows,
                    saleRanking: s.rows
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
});


statRouter.get(`/loyalCustomers`, async (req, res) => {
    const TEXT = `
        SELECT a.full_name, a.email, a.tel_num, SUM(o.total_price) as spent
        FROM accounts a
        INNER JOIN orders o
        ON a.id = o.acc_id
        WHERE a.is_admin = false
        GROUP BY a.full_name, a.email, a.tel_num
        ORDER BY SUM(o.total_price) DESC
        LIMIT 20    
    `;
    try {
        const { rows } = await db.query(TEXT);
        if (!rows[0]) {
            res.status(404).json({
                success: false,
                messeage: 'NOT FOUND',
            });
        }
        else {
            res.status(201).json({
                success: true,
                data: {
                    data: rows,
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
});

module.exports = statRouter;
