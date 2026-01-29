// routes/admin/index.js
const express = require("express");
const router = express.Router();
const User = require("../../models/User");  // تعديل المسار حسب المكان الذي يوجد فيه الموديل
const Chat = require("../../models/Chat"); // تأكد من أنك تستخدم الموديل الصحيح الخاص بالدردشات
const { ensureAuth, ensureRole } = require("../../middlewares/auth");

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

// Admin dashboard
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

      // تحقق من أن البيانات الخاصة بالأدمن موجودة
      if (!userAdmin) {
        return res.status(404).send("Admin not found");
      }

      // جلب الدردشات الخاصة بالأدمن
      const chats = await Chat.find({ adminId: req.user.id })  // تأكد من أن adminId موجود في موديل الدردشة
        .populate("userId", "name email") // استرجاع معلومات المستخدمين المرتبطين بالدردشة (اختياري)
        .populate("messages.userId", "name");  // استرجاع معلومات المرسل في كل رسالة إذا كان لديك "messages" في الـ Chat

      // عرض الصفحة مع بيانات الأدمن والدردشات
      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        user: req.user,
        profileUser: userAdmin, // تمرير بيانات الأدمن إلى الصفحة
        chats: chats,           // تمرير بيانات الدردشات الخاصة بالأدمن
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






