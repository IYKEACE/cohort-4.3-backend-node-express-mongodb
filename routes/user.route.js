import express from "express";
import { forgetPassword, getAllUsers, getSingleUser, loginUser, registerUser, updateUser } from "../controllers/user.controller.js";

// initialize router
const router = express.Router();

// register route
router.post("/create-user", registerUser);
// login route
router.post("/login", loginUser);

//get all users
router.get("/users", getAllUsers)

// single user endpoint
router.get("/:id", getSingleUser);

// update user info
router.put("/:id", updateUser);

//forgot password endpoint
router.post("/forgetpassword", forgetPassword)

export default router;
