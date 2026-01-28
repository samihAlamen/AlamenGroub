const express = require("express");
const router = express.Router();
const Application = require("../../models/Application");
const { ensureAuth, ensureRole } = require("../../middlewares/auth");

// كل الطلبات
router.get(
  "/",
  ensureAuth,
  ensureRole("admin"),
  async (req, res) => {
    const applications = await Application.find()
      .populate("user")
      .populate("scholarship")
      .sort({ submittedAt: -1 });

    res.render("admin/applications/index", {
      title: "Applications",
      applications
    });
  }
);

// تفاصيل طلب
router.get(
  "/:id",
  ensureAuth,
  ensureRole("admin"),
  async (req, res) => {
    const application = await Application.findById(req.params.id)
      .populate("user")
      .populate("scholarship");

    if (!application) {
      return res.redirect("/admin/applications");
    }

    res.render("admin/applications/detail", {
      title: "Application Detail",
      application
    });
  }
);

// قبول
router.post(
  "/:id/approve",
  ensureAuth,
  ensureRole("admin"),
  async (req, res) => {
    await Application.findByIdAndUpdate(req.params.id, {
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy: req.user._id
    });

    res.redirect(`/admin/applications/${req.params.id}`);
  }
);

// رفض
router.post(
  "/:id/reject",
  ensureAuth,
  ensureRole("admin"),
  async (req, res) => {
    await Application.findByIdAndUpdate(req.params.id, {
      status: "rejected",
      reviewedAt: new Date(),
      reviewedBy: req.user._id
    });

    res.redirect(`/admin/applications/${req.params.id}`);
  }
);

module.exports = router;
