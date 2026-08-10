import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Learning", "Fitness", "Finance", "Health"],
      default: "Learning",
    },
    current: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      required: [true, "Target value is required"],
    },
    unit: {
      type: String,
      default: "",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    colorTheme: {
      type: String,
      default: "purple",
    },
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;