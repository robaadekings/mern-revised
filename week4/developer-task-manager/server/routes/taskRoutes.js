const express = require('express');
const {createTask, getmyTasks, getAllTasks, updateTask} = require('../controllers/taskController');
const {protect, authorize} = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createTask);
router.get('/me', protect, getmyTasks);
router.get("/all", protect, authorize(['admin']), getAllTasks);
router.patch('/:id', protect, updateTask);

module.exports = router;