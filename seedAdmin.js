const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cab_taxi_admin');

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@admin.com' });
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit();
    }

    await Admin.create({
      name: 'Super Admin',
      email: 'admin@admin.com',
      password: '123456',
      role: 'SuperAdmin'
    });

    console.log('Admin seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
