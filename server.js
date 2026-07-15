const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body parser (increased limit for large payloads like images)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/driver-auth', require('./routes/driversAuth'));
app.use('/api/v1/customers', require('./routes/customers'));
app.use('/api/v1/drivers', require('./routes/drivers'));
app.use('/api/v1/cars', require('./routes/cars'));
app.use('/api/v1/places', require('./routes/places'));
app.use('/api/v1/bookings', require('./routes/bookings'));
app.use('/api/v1/payments', require('./routes/payments'));
app.use('/api/v1/settings', require('./routes/settings'));
app.use('/api/v1/vehicle-types', require('./routes/vehicleTypes'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));
app.use('/api/v1/contact', require('./routes/contact'));

// Base Route
app.get('/', (req, res) => {
  res.send('Cab Taxi Admin API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
