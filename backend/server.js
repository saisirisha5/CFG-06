// Entry point of the backend server
require('dotenv').config();
const dbconnection = require('./db/connection');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/counsellorRoutes/attendance');

app.use(express.json());

// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('BACKEND BACKEND API');
});

// TODO: Add routes and middleware
app.use('/api', authRoutes);
app.use('/api/attendance', attendanceRoutes);


app.use('/static/images', express.static(path.join(__dirname, 'static/images')));

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});