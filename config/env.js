// config/env.js - إعدادات البيئة العامة

module.exports = {
    PORT: process.env.PORT || 3000,
    SESSION_SECRET: process.env.SESSION_SECRET || 'secretkey',
    JWT_SECRET: process.env.JWT_SECRET || 'jwtsecretkey',
    NODE_ENV: process.env.NODE_ENV || 'development',
};
