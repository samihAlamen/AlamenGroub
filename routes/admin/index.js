// routes/admin/index.js
const express = require("express");
const router = express.Router();

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
      // جلب معلومات الأدمن
      const userAdmin = await User.findById(req.user._id); // التأكد من وجود الـ await
      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        user: req.user,
        profileUser: userAdmin // تمرير معلومات الأدمن إلى الصفحة
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error"); // التعامل مع الاستثناءات
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
