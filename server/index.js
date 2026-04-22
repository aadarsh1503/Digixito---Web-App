import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL]
  : ["http://localhost:5173","https://digixito-web-app.vercel.app"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

connectDB()
  .then(() => app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)))
  .catch((err) => { console.error("DB connection failed:", err.message); process.exit(1); });
