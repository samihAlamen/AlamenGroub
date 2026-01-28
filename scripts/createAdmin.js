const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const connectDB = require('../config/db'); // تأكد هذا يرجع mongoose.connect

async function createAdmin() {
  try {
    // الاتصال بقاعدة البيانات
    await connectDB();

    const adminEmail = 'admin@platform.com';
    const adminPassword = 'Admin@123'; // غيرها بعد أول دخول

    // تحقق إذا الأدمن موجود مسبقًا
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('❌ Admin already exists');
      process.exit();
    }

    // إنشاء الأدمن
    const admin = new User({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword, // سيتم تشفيرها تلقائيًا
      role: 'admin',
    });

    await admin.save();

    console.log('✅ Admin account created successfully');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);

    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
