// Initiate connection to MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

const dburl = process.env.DB_URL ;
mongoose.connect(dburl).then(() => {
    console.log("Connected to DB Successfully");
}).catch((err) => {
    console.log(err.message);
});