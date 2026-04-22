import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file");
  process.exit(1);
}

await connectDB();

const existing = await User.findOne({ email: ADMIN_EMAIL });
if (existing) {
  existing.role = "admin";
  await existing.save();
  console.log(`Promoted ${ADMIN_EMAIL} to admin`);
} else {
  await User.create({
    name: ADMIN_NAME || "Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });
  console.log(`Admin created: ${ADMIN_EMAIL}`);
}

await mongoose.disconnect();
