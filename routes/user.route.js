import express from "express";
import { deleteUser, forgetPassword, getAllUsers, getSingleUser, loginUser, registerUser, updateUser } from "../controllers/user.controller.js";

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

// Update User information
router.put("/:id", updateUser);

//delete user
router.delete("/:id", deleteUser)
//forgot password endpoint
router.post("/forgetpassword", forgetPassword)
 
export default router;
