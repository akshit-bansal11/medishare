require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const donateRoutes = require('./routes/donateRoutes');
const userRoutes = require('./routes/userRoutes');
const verifyRoutes = require('./routes/verifyRoutes')
const cors = require('cors');
const cookieParser = require('cookie-parser');



const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/medicines', donateRoutes);
app.use('/verify', verifyRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
    })
    .catch((err) => console.error(err));

module.exports = app;
