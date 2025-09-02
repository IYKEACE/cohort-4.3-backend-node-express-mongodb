import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";

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

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({
        message: "No user found",
      });
    }
    return res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//get single user
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: `${user.firstname} retrieved successfully`,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// update users
export const updateUser = async (req, res) => {
  // get user id to update
  try {
    const { id } = req.params;
    const { firstname, lastname, email, password, role, address } = req.body; // find user by id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Prepare updated fields
    let updatedFields = {
      firstname: firstname || user.firstname,
      lastname: lastname || user.lastname,
      email: email || user.email,
      role: role || user.role,
      address: address || user.address,
    };

    // Only hash and update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(12);
      updatedFields.password = await bcrypt.hash(password, salt);
    } else {
      updatedFields.password = user.password;
    }

    // update user details
    const userToUpdate = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    return res.status(200).json({
      message: `${userToUpdate.firstname} updated successfully`,
      userToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: `${user.firstname} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

// forgotpassword
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
    // 2. Generate OTP (6-digit)
    const otp = crypto.randomInt(100000, 999999).toString();

    // 3. Set OTP expiration (10 minutes)
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // 4. Send OTP email
    await sendMail({
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 2 minutes.`,
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.6;">
          <h3>Password Reset OTP</h3>
          <p>Your OTP is:</p>
          <h2 style="color:#007bff;">${otp}</h2>
          <p>This code is valid for <b>10 minutes</b>. Do not share it with anyone.</p>
        </div>
      `,
    });

    // 5 response
    return res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// email verification
// otp
