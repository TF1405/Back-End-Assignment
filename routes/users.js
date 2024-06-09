import express from "express";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import db from "../db.js";
import midAuthenticator from "../middleware/auth.js";

const router = express.Router()

//CREATE - Register new user
router.post(
    "/register", 
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a password with 6 or more characters").isLength({min:6})
    ],
    async(req, res) => {
        const {name, email, password} = req.body;

        const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }

    try {
        let user = await db("users").where("email", email).first();

        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db("users").insert(
            {name, email, password: hashedPassword},
            ["id", "name", "email"]
        )
        res.json(newUser)
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
    }
)

//READ - get all users
router.get(
    "/",
    midAuthenticator, 
    async (req, res) => {
        try {
            const users = await db("users").select("id", "name", "email")
            res.json(users)
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error")
        }
    }
)

//UPATE - update user
router.put(
    "/:id", 
    midAuthenticator,
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
    ],
    async (req, res) => {
        const { id } = req.params
        const { name, email } = req.body

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const updatedUser = await db("users").where("id", id).update({name, email}, ["id", "name", "email"])
            res.json(updatedUser);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
)

//DELETE - Delete user
router.delete(
    "/:id",
    midAuthenticator,
    async (req, res) => {
        const {id} = req.params

        try {
            await db("users").where("id", id).del()
            res.json({message: "User was deleted."})
        } catch (err) {
            console.log(err.message)
            res.status(500).send("Server Error")
        }
    }
)

export default router