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

            //tying indicator
            socket.on("typing", () => {
                socket.to(roomId).emit("typing", { username });
            });

            socket.on("stopTyping", () => {
                socket.to(roomId).emit("stopTyping", { username });
            });

            //handle sending message
            socket.on("sendMessage", async ( data)=> {
                const message = await Message.create({
                    sender: user._id,
                    room: roomId,
                    content: data
                });
                const fullMessage = await message.populate('sender', 'username');
                io.to(roomId).emit("newMessage", fullMessage);
            });

            //handle disconnect
            socket.on("disconnect", async () => {
                const offlineUser = await User.findOneAndUpdate(
                    { socketId: socket.id },
                    { isOnline: false},
                );
                io.emit("useroffline", offlineUser.username);
            });

        });
    });
};