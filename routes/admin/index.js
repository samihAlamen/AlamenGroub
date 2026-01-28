// routes/admin/index.js
const express = require("express");
const router = express.Router();

const { ensureAuth, ensureRole } = require("../../middlewares/auth");

const scholarshipRoutes = require("./scholarships");
const applicationRoutes = require("./applications");
const chatRoutes = require('./chat');

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
  (req, res) => {
    res.render("admin/dashboard", {
  title: "Admin Dashboard",
  user: req.user
});

  }
);

// Sub routes
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
