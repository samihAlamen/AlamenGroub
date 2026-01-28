// routes/scholarships.js - المنح الدراسية (عرض، إضافة، تعديل، حذف)

const express = require('express');
const router = express.Router();
const Scholarship = require('../models/Scholarship');
const { ensureAuth, ensureRole } = require('../middlewares/auth');

// عرض كل المنح الدراسية
router.get('/', ensureAuth, async (req, res) => {
    try {
        const scholarships = await Scholarship.find().sort({ createdAt: -1 });
        res.render('scholarships/list', { title: 'المنح الدراسية', scholarships, user: req.session.user });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء جلب المنح الدراسية');
        res.redirect('/dashboard');
    }
});

// صفحة إضافة منحة جديدة - فقط للأدمن
router.get('/add', ensureAuth, ensureRole('admin'), (req, res) => {
    res.render('scholarships/form', { title: 'إضافة منحة جديدة', scholarship: null });
});

// معالجة إضافة منحة جديدة
router.post('/add', ensureAuth, ensureRole('admin'), async (req, res) => {
    const { title, description, requirements, deadline } = req.body;
    try {
        const newScholarship = new Scholarship({
            title,
            description,
            requirements,
            deadline
        });
        await newScholarship.save();
        req.flash('success_msg', 'تمت إضافة المنحة بنجاح');
        res.redirect('/scholarships');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء إضافة المنحة');
        res.redirect('/scholarships/add');
    }
});

// صفحة تعديل منحة
router.get('/edit/:id', ensureAuth, ensureRole('admin'), async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);
        if (!scholarship) {
            req.flash('error_msg', 'المنحة غير موجودة');
            return res.redirect('/scholarships');
        }
        res.render('scholarships/form', { title: 'تعديل المنحة', scholarship });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء جلب المنحة');
        res.redirect('/scholarships');
    }
});

// معالجة تعديل منحة
router.post('/edit/:id', ensureAuth, ensureRole('admin'), async (req, res) => {
    const { title, description, requirements, deadline } = req.body;
    try {
        await Scholarship.findByIdAndUpdate(req.params.id, {
            title,
            description,
            requirements,
            deadline
        });
        req.flash('success_msg', 'تم تعديل المنحة بنجاح');
        res.redirect('/scholarships');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء تعديل المنحة');
        res.redirect(`/scholarships/edit/${req.params.id}`);
    }
});

// حذف منحة
router.post('/delete/:id', ensureAuth, ensureRole('admin'), async (req, res) => {
    try {
        await Scholarship.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'تم حذف المنحة بنجاح');
        res.redirect('/scholarships');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء حذف المنحة');
        res.redirect('/scholarships');
    }
});

// صفحة تفاصيل المنحة
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);
        if (!scholarship) {
            req.flash('error_msg', 'المنحة غير موجودة');
            return res.redirect('/scholarships');
        }
        res.render('scholarships/detail', { title: scholarship.title, scholarship });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'حدث خطأ أثناء جلب تفاصيل المنحة');
        res.redirect('/scholarships');
    }
});

module.exports = router;
