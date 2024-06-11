import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import db from "../db.js";
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()


//Login user
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const { email, password } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await db('users').where('email', email).first();

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
            id: user.id
        }
        };

        jwt.sign(
            payload,
            process.env.ACCESS_TOKEN,
            { expiresIn: 3600 },
            (err, token) => {
            if (err) throw err;
            res.json({ token });
        }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    }
);

export default router