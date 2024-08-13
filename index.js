const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const { v4: uuid } = require('uuid');
const { pool } = require("./connect/db");
app.use(express.json());
//Get all users
app.get('/', async(req,res) => {
    try {
        const result = await pool.query('SELECT * FROM public."User"');// han che select*
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });//ko tra loi 500 cho ng dung 
    }
})
//Get user
app.get('/:id', async(req,res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM public."User" WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'khong tim thay user' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }
})
//Update user

app.put('/:id', async(req,res) => {
    const { id } = req.params;
    const { tendangnhap, pw, hoten, role } = req.body;


    try {
        const userResult = await pool.query('SELECT * FROM public."User" WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'khong tim thay user' });
        }
        
        const user = userResult.rows[0];
        const updatedTendangnhap = tendangnhap || user.tendangnhap;
        const updatedPw = pw || user.pw;
        const updatedHoten = hoten || user.hoten;
        const updatedRole = role || user.role;
        await pool.query(
            'UPDATE public."User" SET tendangnhap=$1, pw=$2, hoten=$3, role=$4 WHERE id=$5',
            [updatedTendangnhap, updatedPw, updatedHoten, updatedRole, id]
        );

        res.json({ message: 'Cap nhat thong tin thanh cong' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }
})
//Create a new user
app.post('/', async(req,res) => {
    const { tendangnhap, pw, hoten, role } = req.body;
//user tu dang ky ko duoc chon phan quyen
    
    if (!tendangnhap||!pw ||!hoten ||!role) {
        return res.status(400).json({ error: 'Yeu cau dien du thong tin' });
    }
    const id = uuid();

    try {
        const userCheck = await pool.query('SELECT id FROM public."User" WHERE tendangnhap = $1', [tendangnhap]);
        if (userCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Ten dang nhap da ton tai' }); // Trả về lỗi 409 Conflict nếu tên tài khoản đã tồn tại
        }
        await pool.query(
            'INSERT INTO public."User" ( id, tendangnhap, pw, hoten, role) VALUES ($1, $2, $3, $4, $5)', 
            [id, tendangnhap, pw, hoten, role]
        );
        res.status(201).json({ id, tendangnhap, pw, hoten, role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: ' server error' });
    }
}) 
//Delete user

app.delete('/:id', async(req,res) => {
    const { id } = req.params;

    try {
        const userResult = await pool.query('SELECT * FROM public."User" WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Thong tin da duoc cap nhat' });
        }
        await pool.query('DELETE FROM public."User" WHERE id = $1', [id]);
        res.json({ message: 'Thong tin da duoc cap nhat' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
    }
})


app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});