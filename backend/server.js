require('dotenv').config();
const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./config/database');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

if (!process.env.JWT_SECRET) throw new Error('Set JWT_SECRET in .env before starting the server.');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  db.query('SELECT 1')
    .then(() => console.log('MySQL connected'))
    .catch((e) => console.error('MySQL connection FAILED:', e.message));
});