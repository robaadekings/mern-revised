require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { Server } = require('socket.io');


const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173" }
});

// socket io connection
require('./socket')(io);

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

//connect to database and start server

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});