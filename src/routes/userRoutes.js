import express from "express";
import { getAllUser, updateUser, deleteUser } from "../controller/userController.js";
import midAuthenticator from "../middleware/auth.js";

const router = express.Router()

router.get("/", midAuthenticator, getAllUser)
router.put("/:id", midAuthenticator, updateUser)
router.delete("/:id", midAuthenticator, deleteUser)

export default router