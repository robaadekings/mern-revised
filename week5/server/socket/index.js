const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('socket connected', socket.id);

        socket.on("joinRoom", async ({ roomId, username }) => {
            const user = await User.findOneAndUpdate(
                { username },
                {socketId: socket.id, isOnline: true},
                { new: true}
            );

            socket.join(roomId);
            io.to(roomId).emit("userJoined", { user, roomId });
        });

        //tying indicator
        socket.on("typing", (data) => {
            socket.to(data.roomId).emit("typing", { username: data.username });
        });

        socket.on("stopTyping", (data) => {
            socket.to(data.roomId).emit("stopTyping", { username: data.username });
        });

        //handle sending message
        socket.on("sendMessage", async (data) => {
            const user = await User.findOne({ socketId: socket.id });
            const message = await Message.create({
                sender: user._id,
                room: data.roomId,
                content: data.content
            });
            const fullMessage = await message.populate('sender', 'username');
            io.to(data.roomId).emit("newMessage", fullMessage);
        });

        //handle disconnect
        socket.on("disconnect", async () => {
            const offlineUser = await User.findOneAndUpdate(
                { socketId: socket.id },
                { isOnline: false},
            );
            if (offlineUser) {
                io.emit("userOffline", offlineUser.username);
            }
        });
    });
};