import user from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// register endpoint
export const registerUser = async (req, res) => {
try {
    const { firstname, lastname, email, password, role, address } = req.body;

    //salting / salt round
    const salt = await bcrypt.genSalt(12);

    // hashpassword
    const hashPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await user({
      firstname,
      lastname,
      email,
      password: hashPassword,
      role,
      address,
    });
    const createUser = await newUser.save();
    return res.status(201).json({
      message: "user successfully created",
      createUser,
    });
} catch (error) {
  return res.status(500).json({
    error: error.message,
  });
}
};

//login endpoint
// forget password endpoint
// email verification endpoint
// otp
