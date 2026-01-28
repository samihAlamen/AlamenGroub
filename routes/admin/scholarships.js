// routes/admin/scholarships.js
const express = require("express");
const router = express.Router();
const slugify = require('slugify');  // مكتبة slugify لتوليد الـ slug

const Scholarship = require("../../models/Scholarship");

// عرض كل المنح
router.get("/", async (req, res) => {
  const scholarships = await Scholarship.find().sort({ createdAt: -1 });

  res.render("admin/scholarships/index", {
    title: "Scholarships",
    scholarships
  });
});

// صفحة إنشاء
router.get("/create", (req, res) => {
  res.render("admin/scholarships/create", {
    title: "Create Scholarship"
  });
});

router.post("/create", async (req, res) => {
  try {
    const requirements = req.body.requirements ? JSON.parse(req.body.requirements) : [];
    const documents = req.body.documents ? JSON.parse(req.body.documents) : [];
const stepsData = req.body.steps ? JSON.parse(req.body.steps) : {
  stepsPerPage: 1,
  steps: []
};

    const newScholarship = await Scholarship.create({
      title: req.body.title,
      slug: slugify(req.body.title, { lower: true, strict: true }),
      description: req.body.description,
      requirements: requirements,
      documents: documents,
      deadline: req.body.deadline,
  steps: stepsData,   // 👈 هنا
      createdBy: req.user._id,
      isActive: true,
    });

    res.redirect("/admin/scholarships");
  } catch (err) {
    console.error(err);
    res.render("admin/scholarships/create", {
      error: "فشل في إنشاء المنحة"
    });
  }
});

// تعديل
router.get("/:id/edit", async (req, res) => {
  const scholarship = await Scholarship.findById(req.params.id);
  if (!scholarship) return res.redirect("/admin/scholarships");

  res.render("admin/scholarships/edit", {
    title: "Edit Scholarship",
    scholarship
  });
});

// تحديث
router.post("/:id/edit", async (req, res) => {
  await Scholarship.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    deadline: req.body.deadline,
    steps: JSON.parse(req.body.steps),
    isActive: req.body.isActive === "on"
  });

  res.redirect("/admin/scholarships");
});

// حذف
router.post("/:id/delete", async (req, res) => {
  await Scholarship.findByIdAndDelete(req.params.id);
  res.redirect("/admin/scholarships");
});

module.exports = router;
