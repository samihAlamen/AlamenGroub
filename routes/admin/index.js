// routes/admin/index.js
const express = require("express");
const router = express.Router();
const User = require("../../models/User");  // تعديل المسار حسب المكان الذي يوجد فيه الموديل

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
      if (!req.user || !req.user._id) {
        return res.status(401).send("User not authenticated or user ID missing");
      }

      const userAdmin = await User.findById(req.user._id);
      
      // تحقق من أن البيانات الخاصة بالأدمن موجودة
      if (!userAdmin) {
        return res.status(404).send("Admin not found");
      }

      // عرض الصفحة مع بيانات الأدمن
      res.render("admin/dashboard", {
        title: "Admin Dashboard",
        user: req.user,
        profileUser: userAdmin, // تمرير بيانات الأدمن إلى الصفحة
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


