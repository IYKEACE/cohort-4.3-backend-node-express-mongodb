import User from "../model/User.js";
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
    const newUser = await User({
      firstname,
      lastname,
      email,
      password: hashPassword,
      role,
      address,
    });
    // find if user already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).send("User already exist");
    }
    const createdUser = await newUser.save();
    return res.status(201).json({
      message: `${createdUser.firstname} successfully created`,
      createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//login endpoint

export const loginUser = async (req, res) => {
  try {
    // email and password
    const { email } = req.body;
    // check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    // Check if password match
    const checkIfPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // if does not match
    if (!checkIfPasswordMatch) {
      return res.status(401).json({
        message: "Invalid User credentials",
      });
    }
    // generate token
    const token = await jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    // omit password
    const { password, ...otherUserData } = user._doc;
    return res.status(200).json({
      message: "User successfully logged in",
      otherUserData,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// forgotpassword
// email verification
// otp
