import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Habit title is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    emoji: {
      type: String,
      default: "⚡",
    },
    colorClass: {
      type: String,
      default: "stroke-cyan-400",
    },
    rate: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
    },
    completedToday: {
      type: Boolean,
      default: false,
    },
    // Useful for multi-user / user-specific data
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Set to true if authentication middleware is used
    },
  },
  { timestamps: true }
);

export default mongoose.models.Habit || mongoose.model("Habit", habitSchema);