// routes/admin/index.js
const express = require("express");
const router = express.Router();
const User = require("../../models/User");  // تعديل المسار حسب المكان الذي يوجد فيه الموديل
const Chat = require("../../models/Chat"); // تأكد من أنك تستخدم الموديل الصحيح الخاص بالدردشات
const { ensureAuth, ensureRole } = require("../../middlewares/auth");
const Scholarship = require("../../models/Scholarship");

const scholarshipRoutes = require("./scholarships");
const applicationRoutes = require("./applications");
const chatRoutes = require('./chat');

// استخدام الـ middleware الخاص بالدردشة
router.use(
  '/chat',
  ensureAuth,
  ensureRole('admin'),
  chatRoutes
);

router.get(
  "/",
  ensureAuth,
  ensureRole("admin"),
  async (req, res) => {
    try {
      // تحقق من أن `req.user` يحتوي على البيانات الصحيحة
      if (!req.user || !req.user.id) {
        return res.status(401).send("User not authenticated or user ID missing");
      }

      // جلب بيانات الأدمن بناءً على _id
      const userAdmin = await User.findById(req.user.id);

      if (!userAdmin) {
        return res.status(404).send("Admin not found");
      }

      // جلب الدردشات الخاصة بالأدمن
      const chats = await Chat.find({ adminId: req.user.id })
        .populate("userId", "name email")
        .populate("messages.userId", "name");

      // بيانات الرسم البياني (عدد المنح المتاحة والمنتهية)
      const availableScholarships = await Scholarship.countDocuments({ status: 'available' });
      const expiredScholarships = await Scholarship.countDocuments({ status: 'expired' });

      // بيانات الرسم البياني
      const chartData = {
        labels: ['المنح المتاحة', 'المنح المنتهية'],
        data: [availableScholarships, expiredScholarships]
      };

      // عرض الصفحة مع بيانات الأدمن والدردشات
      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        user: req.user,
        profileUser: userAdmin,
        chats: chats,
        chartData: chartData  // تمرير بيانات الرسم البياني إلى الصفحة
      });

    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Sub routes for scholarships and applications
router.use(
  "/scholarships",
  ensureAuth,
  ensureRole("admin"),
  scholarshipRoutes
);

router.use(
  "/applications",
  ensureAuth,
  ensureRole("admin"),
  applicationRoutes
);

module.exports = router;








