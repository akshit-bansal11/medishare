const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB Error:', err));

app.use('/admin', adminRoutes);

app.listen(process.env.PORT || 5001, () => {
  console.log('Admin Server running on port', process.env.PORT || 5001);
});
