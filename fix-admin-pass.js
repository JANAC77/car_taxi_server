const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

async function fixAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    let admin = await Admin.findOne({ email: 'admin@admin.com' });
    if (!admin) {
      console.log('Admin not found, creating...');
      admin = new Admin({
        name: 'Super Admin',
        email: 'admin@admin.com',
        role: 'SuperAdmin'
      });
    }

    // Set the password to match what the frontend Login.jsx expects
    admin.password = '123456';
    await admin.save();
    
    console.log('Successfully set admin@admin.com password to 123456');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixAdminPassword();
