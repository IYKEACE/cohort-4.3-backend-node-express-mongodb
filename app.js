import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./databaseConnection/connection.js";


dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

// connection
connectToDatabase();

app.listen(port, () => {
  console.log(`Server is running on localhost: ${port}`);
});
 