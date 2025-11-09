require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const postsRoute = require('./routes/posts');
const categoriesRoute = require('./routes/categories');
const authRoute = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/categories', categoriesRoute);

app.use(errorHandler);

connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on ${PORT}`)))
  .catch(err => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });
