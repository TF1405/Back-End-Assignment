import express from "express";
// import userRouter from "./routes/users.js";
// import authRouter from "./controller/auth.js";
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js"

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res, next) => {
    res.status(404).json({message: "Route not found"})
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server are running on port ${PORT}`)
})