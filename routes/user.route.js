import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

// initialize router
const router = express.Router();

// register route
router.post("/create-user", registerUser);
// login route
router.post("/login", loginUser);

export default router;
