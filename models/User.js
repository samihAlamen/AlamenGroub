const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for the User model
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  username: { type: String, required: true },

    role: { type: String, enum: ['admin', 'user'], required: true }, // admin or user
  avatar: { type: String }, // رابط الصورة الشخصية
    profile: {
      phone: String,
      country: String,
      university: String,
      major: String,
      bio: String,
      avatar: String,
    },

    // المنح التي قدّم عليها المستخدم
    appliedScholarships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
      },
    ],
  },
  {
    timestamps: true, // createdAt + updatedAt تلقائيًا
  }
);

// 🔐 تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔍 مقارنة كلمة المرور عند تسجيل الدخول
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

