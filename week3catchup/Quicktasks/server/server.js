const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const tasksRoutes = require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// Routes

app.use("/api/tasks", tasksRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}` );
});