// routes/applications.js - إدارة طلبات الطلاب

const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');
const { ensureAuth, ensureRole } = require('../middlewares/auth');
const upload = require('../middlewares/upload'); // multer لرفع الملفات

// عرض كل الطلبات (للأدمن والموظف)
router.get('/', ensureAuth,  async (req, res) => {
    try {
        const applications = await Application.find().populate('scholarship').sort({ createdAt: -1 });

        // التأكد من وجود createdAt أو تعيين تاريخ افتراضي
        applications.forEach(app => {
            if (!app.createdAt) {
                app.createdAt = new Date();  // تعيين تاريخ اليوم إذا كان غير موجود
            }
        });

        res.render('applications/list', { title: 'طلبات الطلاب', applications });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء جلب الطلبات');
        res.redirect('/dashboard');
    }
});


// صفحة تفاصيل طلب طالب
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('scholarship');
        if (!application) {
            req.flash('error_msg', 'الطلب غير موجود');
            return res.redirect('/applications');
        }
        // السماح للطالب برؤية طلبه فقط أو الأدمن/الموظف
        if (req.session.user.role === 'user' && application.user.toString() !== req.session.user.id) {
            req.flash('error_msg', 'ليس لديك صلاحية لرؤية هذا الطلب');
            return res.redirect('/dashboard');
        }
        res.render('applications/detail', { title: 'تفاصيل الطلب', application });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء جلب تفاصيل الطلب');
        res.redirect('/applications');
    }
});

// تقديم طلب جديد للمنحة - للطالب فقط
router.get('/apply/:scholarshipId', ensureAuth, ensureRole('user'), async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.scholarshipId);
        if (!scholarship) {
            req.flash('error_msg', 'المنحة غير موجودة');
            return res.redirect('/scholarships');
        }
        res.render('applications/form', { title: `تقديم طلب - ${scholarship.title}`, scholarship });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء التحضير لتقديم الطلب');
        res.redirect('/scholarships');
    }
});

// معالجة تقديم الطلب مع رفع الملفات
router.post(
  '/apply/:scholarshipId',
  ensureAuth,
  ensureRole('user'),
  upload.any(),
  async (req, res) => {
    try {
      const scholarship = await Scholarship.findById(req.params.scholarshipId);
      if (!scholarship) {
        req.flash('error_msg', 'المنحة غير موجودة');
        return res.redirect('/scholarships');
      }

      const exists = await Application.findOne({
        user: req.session.user.id,
        scholarship: scholarship._id
      });
      if (exists) {
        req.flash('error_msg', 'سبق لك التقديم على هذه المنحة');
        return res.redirect('/applications');
      }

      const answers = {};
      const files = {};

      for (const key in req.body) {
        answers[key] = req.body[key];
      }

      (req.files || []).forEach(file => {
        files[file.fieldname] = {
          originalName: file.originalname,
          path: file.path
        };
      });

      await Application.create({
        user: req.session.user.id,
        scholarship: scholarship._id,
        answers,
        files,
        status: 'pending'
      });

      req.flash('success_msg', 'تم تقديم الطلب بنجاح');
      res.redirect('/applications');

    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'حدث خطأ أثناء تقديم الطلب');
      res.redirect(`/applications/apply/${req.params.scholarshipId}`);
    }
  }
);

// تحديث حالة الطلب (للأدمن والموظف)
router.post('/update-status/:id', ensureAuth, ensureRole(['admin', 'staff']), async (req, res) => {
    const { status } = req.body;
    try {
        await Application.findByIdAndUpdate(req.params.id, { status });
        req.flash('success_msg', 'تم تحديث حالة الطلب بنجاح');
        res.redirect('/applications');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء تحديث الحالة');
        res.redirect('/applications');
    }
});

module.exports = router;
