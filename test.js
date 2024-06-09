import dotenv from "dotenv";
dotenv.config()

console.log(`database host ${process.env.DB_HOST}`)
console.log(`database name ${process.env.DB_NAME}`)