const Task = require('../models/Task');

// Create a new task

exports.createTask = async (req, res) => {
    try {
        // Normalize input from client: accept { title, description } or { text }
        const payload = { owner: req.user.id };
        if (req.body.title) payload.title = req.body.title;
        if (req.body.description) payload.description = req.body.description;
        if (req.body.text) payload.text = req.body.text;

        const task = await Task.create(payload);
        return res.status(201).json({ task });
    } catch (err) {
        console.error('Create task error:', err);
        // If validation error, return clearer message
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message).join('; ');
            return res.status(400).json({ message: 'Validation failed', details: messages });
        }
        return res.status(500).json({ message: 'Unable to create task', error: err.message });
    }
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

// Update a task (owner or admin) - partial updates allowed
exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Only owner or admin can update
        if (String(task.owner) !== String(req.user.id) && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        // Only allow updating specific fields
        const allowed = ['title', 'description', 'text', 'completed'];
        allowed.forEach(field => {
            if (typeof req.body[field] !== 'undefined') task[field] = req.body[field];
        });

        await task.save();
        return res.json({ task });
    } catch (err) {
        console.error('Update task error:', err);
        return res.status(500).json({ message: 'Unable to update task', error: err.message });
    }
};