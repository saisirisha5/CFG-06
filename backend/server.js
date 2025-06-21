// Entry point of the backend server
require('dotenv').config();
const dbconnection = require('./db/connection');
const express = require('express');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const householdRoutes = require('./routes/householdRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const attendanceRoutes = require('./routes/counsellorRoutes/attendanceRoutes');

// Enable All CORS Requests
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:5175",
      "http://localhost:5176",
    ],
    credentials: true,
  })
);


app.use(express.json());

// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('BACKEND BACKEND API');
});

// TODO: Add routes and middleware

app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.use('/api/households', householdRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/static/images', express.static(path.join(__dirname, 'static/images')));


app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});