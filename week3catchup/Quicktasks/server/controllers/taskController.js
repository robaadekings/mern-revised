 const Task = require('../models/Task');

// Get all tasks

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
};

//update a task 
const updateTask = async (req, res) => {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
};

module.exports = {getTasks, createTask, updateTask, deleteTask};