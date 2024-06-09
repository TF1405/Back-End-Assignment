import express from "express";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js"
import cors from "cors"

const app = express();

app.use(cors())

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server are running on port ${PORT}`)
})