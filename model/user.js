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
      type: Array,
      default: ["user"],
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
