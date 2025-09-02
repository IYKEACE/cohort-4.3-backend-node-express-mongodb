import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    lastname: {
      type: String,
      min: 3,
      max: 30,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      min: 8,
      max: 25,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2020/06/29/20/31/man-5354308_1280.png",
    },
    referralCode: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpire: {
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
