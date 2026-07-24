import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

seedAdmin();