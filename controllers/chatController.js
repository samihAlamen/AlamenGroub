const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

exports.list = async (req, res) => {
  try {
    if (req.user.role === 'user') {
      // إذا كان طالبًا، نظهر له المحادثة مع الأدمن فقط
      const convs = await Conversation.find({ 'participants.user': req.user.id })
        .populate('participants.user', 'username avatar')
        .lean();

      res.render('conversations', { conversations: convs, user: req.user });
    } else if (req.user.role === 'admin') {
      // إذا كان أدمن، نظهر له قائمة الطلاب الذين أرسلوا له رسائل
      const convs = await Conversation.find({ 'participants.user': req.user.id })
        .populate('participants.user', 'username avatar')
        .lean();

      res.render('conversations', { conversations: convs, user: req.user });
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
          { user: req.user.id, role: 'admin' },
          { user: otherUserId, role: 'user' }
        ],
        student: otherUserId,
        admin: req.user.id
      });
    }

    const msgs = await Message.find({ conversation: conv.id }).sort('createdAt').lean();
    const otherParticipant = conv.participants.find(p => !p.user.equals(req.user.id));

    // التأكد من أن الـ otherUser موجود
    if (!otherParticipant) {
      return res.status(400).send('The other party cannot be found in the conversation.');
    }

    // تمرير المتغيرات إلى الـ EJS
    res.render('chat', {
      conversation: conv,
      messages: msgs,
      user: req.user,
      otherUser: otherParticipant.user // يجب أن يكون .user هنا
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('A server error occurred.');
  }
};










