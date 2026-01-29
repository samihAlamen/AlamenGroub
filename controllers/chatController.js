const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

exports.list = async (req, res) => {
  try {
    // التحقق من نوع المستخدم: هل هو طالب أو أدمن؟
    if (req.user.role === 'student') {
      // إذا كان طالبًا، نظهر له المحادثة مع الأدمن فقط
      const convs = await Conversation.find({ participants: req.user.id })
        .sort('-updatedAt')
        .populate('participants', 'username avatar')
        .lean();

      // تصفية المحادثات لعرض محادثات الطالب مع الأدمن فقط
      const adminConversations = convs.filter(conv => conv.participants.some(p => p.role === 'admin'));

      res.render('conversations', { conversations: adminConversations, user: req.user });
    } else if (req.user.role === 'admin') {
      // إذا كان أدمن، نظهر له قائمة الطلاب الذين أرسلوا له رسائل
      const convs = await Conversation.find({ participants: req.user.id })
        .sort('-updatedAt')
        .populate('participants', 'username avatar')
        .lean();

      // تصفية المحادثات لعرض المحادثات مع الطلاب فقط
      const studentConversations = convs.filter(conv => conv.participants.some(p => p.role === 'student'));

      res.render('conversations', { conversations: studentConversations, user: req.user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('A server error occurred.');
  }
};



exports.create = async (req, res) => {
  const { otherId } = req.body;
  let conv = await Conversation.findOne({ participants: { $all: [req.user.id, otherId] } });
  if (!conv) conv = await Conversation.create({ participants: [req.user.id, otherId] });
  res.json({ convId: conv.id });
};

exports.show = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const other = await User.findById(otherUserId);
    if (!other) return res.status(404).send('User not found');

    // جلب المحادثة بين الأدمن والطالب
    let conv = await Conversation.findOne({
      participants: { $all: [req.user.id, otherUserId] }
    }).populate('participants', 'username avatar');

    if (!conv) {
      // إذا لم تكن المحادثة موجودة، نقوم بإنشائها
      conv = await Conversation.create({ participants: [req.user.id, otherUserId] });
      conv = await Conversation.findById(conv.id).populate('participants', 'username avatar');
    }

    // جلب الرسائل المرتبطة بالمحادثة
    const msgs = await Message.find({ conversation: conv.id }).sort('createdAt').lean();

    // تحديد الشخص الآخر في المحادثة
    const otherParticipant = conv.participants.find(p => !p._id.equals(req.user.id));
    if (!otherParticipant) {
      return res.status(400).send('The other party cannot be found in the conversation.');
    }

    res.render('chat', {
      conversation: conv,
      messages: msgs,
      user: req.user,
      otherUser: otherParticipant,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('A server error occurred.');
  }
};







