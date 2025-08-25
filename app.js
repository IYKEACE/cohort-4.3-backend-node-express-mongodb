import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./databaseConnection/connection.js";
import UserRoute from "./routes/user.route.js";
import morgan from "morgan";

dotenv.config();

const app = express();

// parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// logger
app.use(morgan("dev"));

const port = process.env.PORT || 8000;

// connection
connectToDatabase();

app.get("/", (req, res) => {
  res.send("Hello Mongodb");
});

// users Routes
app.use("/api/v1/user", UserRoute);

app.listen(port, () => {
  console.log(`Server is running on localhost: ${port}`);
});
