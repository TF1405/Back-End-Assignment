import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import db from "../db.js";
import dotenv from "dotenv";
dotenv.config()

export const register = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({min: 6}),
    async(req, res, next) => {
        const { name, email, password } = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array })
        }
    
    try {
        let user = await db("users").where("email", email).first();
        if (user) {
            return res.status(400).json({ msg: "User already exist" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const [newUser] = await db("users").insert(
            {name, email, password: hashedPassword },
            ["id", "name", "email"]
        )

        const payload = { user: { id: newUser.id }}
        jwt.sign(payload, process.env.ACCESS_TOKEN, 
            {expiresIn: 3600 }, 
            (err, token) => {
                if (err) throw err
                res.json({token})
            }
        )
    } catch (err) {
        next(err)
    }
    
    
    }
]

export const login = [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
    async (req, res, next) => {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors : errors.array})
        }

        try {
            const user = await db("users").where("email", email).first();
            if (!user) {
                return res.status(400).json({ msg: "Invalid Credentials"})
            }

            const isMatch = await bcryptjs.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid Credentials"})
            }

            const payload = { user: {id: user.id}}
            jwt.sign(payload, process.env.ACCESS_TOKEN, 
                {expiresIn:3600},
                (err, token) => {
                    if (err) throw err;
                    res.json({token})
                }
            )
        } catch (err) {
            next(err)
        }
    }
    
]