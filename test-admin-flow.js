async function testAdminFlow() {
  try {
    const mongoose = require('mongoose');
    const Admin = require('./models/Admin');
    const bcrypt = require('bcryptjs');
    const dotenv = require('dotenv');
    dotenv.config();
    await mongoose.connect(process.env.MONGO_URI);
    
    // Ensure we have a working admin account
    let admin = await Admin.findOne({ email: 'admin@admin.com' });
    if (admin) {
      admin.password = 'password123';
      await admin.save();
      console.log('Reset admin@admin.com password to password123');
    } else {
      admin = await Admin.create({
        name: 'Super Admin',
        email: 'admin@admin.com',
        password: 'password123',
        role: 'SuperAdmin' // wait, is it 'SuperAdmin' or 'admin'?
      });
    }

    console.log('Logging in as Admin...');
    const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@admin.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    
    if (loginData.token) {
      console.log('Fetching stats...');
      const dashRes = await fetch('http://localhost:5000/api/v1/dashboard/stats', {
        headers: { Authorization: `Bearer ${loginData.token}` }
      });
      console.log('Dashboard Status:', dashRes.status);
      const dashData = await dashRes.json();
      console.log('Dashboard Response:', dashData);
      
      console.log('Fetching bookings...');
      const bookRes = await fetch('http://localhost:5000/api/v1/bookings', {
        headers: { Authorization: `Bearer ${loginData.token}` }
      });
      console.log('Bookings Status:', bookRes.status);
    }
    
    mongoose.disconnect();
  } catch(e) {
    console.error(e);
  }
}
testAdminFlow();
