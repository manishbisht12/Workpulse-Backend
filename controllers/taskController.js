import Task from "../models/Task.js";

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, category, dueDate, priority, status, description } = req.body;

    // Check only title as mandatory
    if (!title || !title.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: "Title is required" 
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      category: category || "Development",
      dueDate: dueDate || null, // Handle empty string gracefully
      priority: priority || "Medium",
      status: status || "Pending",
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to update this task" });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task removed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};