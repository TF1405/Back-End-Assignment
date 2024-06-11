import { check, validationResult } from "express-validator";
import db from "../db.js";

export const getAllUser = async (req, res, next) => {
    try {
        const users = await db("users").select("id", "name", "email");
        res.json(users)
    } catch (err) {
        next(err)
    }
}

export const updateUser = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    async (req, res, next) => {
        const { id } = req.params;
        const { name, email } = req.body;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const updatedUser = await db("users").where("id", id).update({name, email}, ["id", "name", "email"]);
            res.json(updatedUser)
        } catch(err) {
            next(err)
        }
    }
]

export const deleteUser = async (req, res, next) => {
    const {id} = req.params
    try {
        await db("users").where("id", id).del();
        res.json({message: "User was deleted."});
    } catch(err) {
        next(err)
    }
}