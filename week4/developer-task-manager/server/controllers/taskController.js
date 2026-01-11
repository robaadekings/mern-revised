const Task = require('../models/Task');

// Create a new task

exports.createTask = async (req, res) => {
    const task = await Task.create({...req.body, owner: req.user.id});
};

// Get all tasks for the logged-in user

exports.getmyTasks = async (req, res) => {
    const tasks = await Task.find({owner: req.user.id});
    res.json({tasks});
};

//get all tasks (admin only)

exports.getAllTasks = async (req, res) => {
    const tasks = await Task.find().populate('owner', 'email role');
    res.json({tasks});
};