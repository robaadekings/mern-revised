require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
// Validate required environment variables early
const requiredEnvs = ['MONGO_URI', 'JWT_SECRET'];
const missing = requiredEnvs.filter(k => !process.env[k]);
if (missing.length) {
	console.error('Missing required env vars:', missing.join(', '));
	console.error('Please add them to server/.env and restart the server. Example: JWT_SECRET=some_long_random_value');
	process.exit(1);
}

// Connect to database
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Connect to database
 const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));