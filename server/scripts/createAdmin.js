import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";

await connectDB();

const existing = await User.findOne({ email: "aadi@gmail.com" });
if (existing) {
  existing.role = "admin";
  await existing.save();
  console.log("Existing user promoted to admin — email: aadi@gmail.com");
} else {
  await User.create({
    name: "Aadi",
    email: "aadi@gmail.com",
    password: "123456",
    role: "admin",
  });
  console.log("Admin created — email: aadi@gmail.com | password: 123456");
}

await mongoose.disconnect();
