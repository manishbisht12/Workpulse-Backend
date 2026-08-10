import Goal from "../models/Goal.js";

const COLOR_THEMES = ["purple", "emerald", "orange", "cyan", "violet", "rose"];

// @desc    Get user's goals
// @route   GET /api/goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id || req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: goals.length, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
export const createGoal = async (req, res) => {
  try {
    const { title, category, current, target, unit, dueDate } = req.body;
    const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];

    const goal = await Goal.create({
      user: req.user._id || req.user.id,
      title,
      category,
      current: Number(current) || 0,
      target: Number(target),
      unit: unit || "",
      dueDate,
      colorTheme: randomTheme,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: "Goal not found" });
    }

    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    if (goal.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "User not authorized" });
    }

    await goal.deleteOne();
    res.status(200).json({ success: true, message: "Goal removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};