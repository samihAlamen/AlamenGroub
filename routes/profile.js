const express = require('express');
const router = express.Router();
const { ensureAuth, ensureRole } = require('../middlewares/auth');
const User = require('../models/User');

router.get('/', ensureAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id)
      .populate({
        path: 'appliedScholarships',
        populate: { path: 'scholarship' }
      });

    res.render('profile', {
      title: 'الملف الشخصي',
      user
    });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});





module.exports = router;
