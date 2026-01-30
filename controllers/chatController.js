const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// عرض قائمة المحادثات
exports.list = async (req, res) => {
  try {
    let convs;
    if (req.user.role === 'user') {
      // إذا كان طالبًا، نظهر له المحادثة مع الأدمن فقط
      convs = await Conversation.find({ 'participants.user': req.user.id })
        .populate('participants.user', 'username avatar')
        .lean();
    } else if (req.user.role === 'admin') {
      // إذا كان أدمن، نظهر له قائمة الطلاب الذين أرسلوا له رسائل
      convs = await Conversation.find({ 'participants.user': req.user.id })
        .populate('participants.user', 'username avatar')
        .lean();
    }

    res.render('conversations', { conversations: convs, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('A server error occurred.');
  }
};

// عرض محادثة معينة
exports.show = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const other = await User.findById(otherUserId);
    if (!other) {
      return res.status(404).send('User not found');
    }

    // جلب المحادثة بين الأدمن والطالب
    let conv = await Conversation.findOne({
      'participants.user': { $all: [req.user.id, otherUserId] }
    }).populate('participants.user', 'username avatar');

    if (!conv) {
      // إذا لم تكن المحادثة موجودة، نقوم بإنشائها
      conv = await Conversation.create({
        participants: [
          { user: req.user.id, role: req.user.role === 'admin' ? 'admin' : 'user' },
          { user: otherUserId, role: req.user.role === 'admin' ? 'user' : 'admin' }
        ],
        student: otherUserId,
        admin: req.user.id
      });
    }

    // البحث عن الرسائل في المحادثة وترتيبها
    const msgs = await Message.find({ conversation: conv.id }).sort('createdAt').lean();

    // التأكد من وجود الطرف الآخر
    const otherParticipant = conv.participants.find(p => !p.user.equals(req.user.id));

    if (!otherParticipant) {
      return res.status(400).send('The other party cannot be found in the conversation.');
    }

    // تمرير المتغيرات إلى الـ EJS
    res.render('chat', {
      conversation: conv,
      messages: msgs,
      user: req.user,
      otherUser: otherParticipant.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('A server error occurred.');
  }
};

// إرسال رسالة
exports.create = async (req, res) => {
  const { otherId } = req.body;
  try {
    // التحقق من وجود المحادثة بين المستخدمين
    let conv = await Conversation.findOne({ participants: { $all: [req.user.id, otherId] } });
    if (!conv) {
      // إذا لم تكن موجودة، نقوم بإنشائها
      conv = await Conversation.create({ participants: [req.user.id, otherId] });
    }
    res.json({ convId: conv.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to create conversation');
  }
};

