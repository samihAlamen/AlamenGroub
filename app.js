// app.js - الملف الرئيسي للتطبيق

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const http = require('http');
const socketIo = require('socket.io');
// تحميل إعدادات البيئة
dotenv.config();

// اتصال قاعدة البيانات
const dbConnect = require('./config/db');
dbConnect();

// استدعاء الموديلات (اختياري، إذا ستستخدمهم في middleware)
const User = require('./models/User');

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const scholarshipsRouter = require('./routes/scholarships');
const applicationsRouter = require('./routes/applications');
const chatRouter = require('./routes/chat');
const notificationsRouter = require('./routes/notifications');
const adminChatRoutes = require('./routes/adminChat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

require('./sockets/chatSocket')(io);
// ==================== إعدادات View Engine ====================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // المسار داخل views بدون .ejs

// ==================== Middleware عام ====================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ==================== Sessions & Flash ====================
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// ==================== Middleware لجعل المتغيرات متاحة في EJS ====================
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');

    res.locals.currentUser = req.session.user || null;
    req.user = req.session.user || null;

    next();
});

app.use((req, res, next) => {
    res.locals.title = 'منصة المنح الدراسية'; // قيمة افتراضية
        res.locals.user = req.session.user || null;
    next();
});

// ==================== الراوترات ====================
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/scholarships', scholarshipsRouter);
app.use('/applications', applicationsRouter);
app.use('/chat', chatRouter);
app.use('/notifications', notificationsRouter);
app.use('/profile', require('./routes/profile'));

app.use('/admin/chat', adminChatRoutes);
app.use("/admin", require("./routes/admin"));

// ==================== صفحة 404 ====================
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found', layout: 'layouts/main' });
});

// ==================== بدء السيرفر ====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
