const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ensureAuth = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user; // توحيد المصدر
        return next();
    }
    return res.redirect('/auth/login');
};

// Middleware للتأكد أن المستخدم غير مسجل دخول
const ensureGuest = (req, res, next) => {
    if (req.session?.user) {
        return res.redirect('/dashboard');
    }
    next();
};

// Middleware للتحقق من صلاحيات الدور
const ensureRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).send('Access denied'); // أو flash + redirect لو صفحة
        }
        next();
    };
};

module.exports = { ensureAuth, ensureGuest, ensureRole };

