import Habit from "../models/Habit.js";

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
export const getHabits = async (req, res) => {
  try {
    // Filter habits strictly by the authenticated user ID
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: habits.length,
      data: habits,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
export const createHabit = async (req, res) => {
  try {
    const { title, category, emoji, colorClass } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const habit = await Habit.create({
      title,
      category: category || "General",
      emoji: emoji || "⚡",
      colorClass: colorClass || "stroke-cyan-400",
      user: req.user._id, // Assign logged in user ID
    });

    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Toggle habit status
// @route   PATCH /api/habits/:id/toggle
export const toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }

    const isNowCompleted = !habit.completedToday;
    let newStreak = habit.streak;

    if (isNowCompleted) {
      newStreak += 1;
    } else {
      newStreak = Math.max(0, newStreak - 1);
    }

    habit.completedToday = isNowCompleted;
    habit.streak = newStreak;
    habit.bestStreak = Math.max(habit.bestStreak, newStreak);

    // 🔴 RATE CALCULATION FIX:
    // Basic calculation: (streak / bestStreak) * 100
    // Pehle din agar mark complete hua (newStreak = 1), toh Rate 100%
    if (habit.bestStreak > 0) {
      habit.rate = Math.round((habit.streak / habit.bestStreak) * 100);
    } else {
      habit.rate = 0;
    }

    await habit.save();

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Habit removed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};