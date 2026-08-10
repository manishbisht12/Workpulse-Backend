import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use('/api/tasks', taskRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/goals", goalRoutes);


// Base route
app.get("/", (req, res) => {
  res.send("WorkPulse API is running...");
});

// Handle Unknown Routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});