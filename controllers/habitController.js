import Habit from "../models/Habit.js";

const calculateRate = (streak, completedToday) => {
  const currentStreak = streak || 0;

  if (currentStreak === 0) return 0;
  if (completedToday) return 100;

  const expectedDays = currentStreak + 1;

  // Example: Streak = 1, Expected = 2 -> (1 / 2) * 100 = 50%
  const rate = Math.round((currentStreak / expectedDays) * 100);
  return Math.min(100, Math.max(0, rate));
};

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const updatedHabits = await Promise.all(
      habits.map(async (habit) => {
        const lastUpdated = habit.updatedAt ? new Date(habit.updatedAt) : null;
        const lastUpdatedStr = lastUpdated 
          ? `${lastUpdated.getFullYear()}-${String(lastUpdated.getMonth() + 1).padStart(2, '0')}-${String(lastUpdated.getDate()).padStart(2, '0')}`
          : null;

        if (lastUpdatedStr && lastUpdatedStr !== todayStr && habit.completedToday) {
          habit.completedToday = false;
        }

        habit.rate = calculateRate(habit.streak, habit.completedToday);
        await habit.save();

        return habit;
      })
    );

    res.status(200).json({
      success: true,
      count: updatedHabits.length,
      data: updatedHabits,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      user: req.user._id,
      rate: 0,
      streak: 0,
      bestStreak: 0,
      completedToday: false,
    });

    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const toggleHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({ success: false, message: "Habit not found" });
    }

    const isNowCompleted = !habit.completedToday;
    let newStreak = isNowCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1);

    habit.completedToday = isNowCompleted;
    habit.streak = newStreak;
    habit.bestStreak = Math.max(habit.bestStreak, newStreak);
    habit.rate = calculateRate(habit.streak, habit.completedToday);

    await habit.save();

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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