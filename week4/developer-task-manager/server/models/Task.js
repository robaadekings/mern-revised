const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    title: { type: String },
    text: { type: String },
    description: { type: String },
    completed: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Ensure at least one of `title` or `text` is provided
// Use a synchronous pre hook without `next` to avoid callback-style invocation errors
taskSchema.pre('validate', function() {
    if (!this.title && !this.text) {
        this.invalidate('title', 'Either title or text is required');
    }
});

module.exports = mongoose.model('Task', taskSchema);