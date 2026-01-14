const Message = require('../models/Message');

exports.getRoomMessages = async (req, res) => {
    const messages = await Message.find({ roomId: req.params.roomId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });
    res.status(200).json({ messages });

};