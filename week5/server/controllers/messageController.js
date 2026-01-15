const Message = require('../models/Message');

exports.getRoomMessages = async (req, res) => {
    try {
        const messages = await Message.find({ room: req.params.roomId })
          .populate('sender', 'username')
          .sort({ createdAt: 1 });
        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};