const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

exports.list = async (req, res) => {
  try {
    // جلب المحادثات التي تحتوي على الأدمن في قائمة المشاركين
    const convs = await Conversation.find({ participants: req.user.id })
      .sort('-updatedAt')
      .populate('participants', 'username avatar') // جلب بيانات المشاركين
      .lean();

    // عرض صفحة المحادثات مع كل المحادثات
    res.render('conversations', { conversations: convs, user: req.user });
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

    // جلب المحادثة بين الأدمن والطالب المحدد
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

    // جلب الطالب إذا كان موجودًا في المحادثة
    let student;
    if (conv.student) {
      student = await User.findById(conv.student);  // جلب الطالب باستخدام الحقل 'student'
    }

    // تحديد الشخص الآخر في المحادثة (الذي ليس الأدمن)
    const otherParticipant = conv.participants.find(p => !p._id.equals(req.user.id));
    if (!otherParticipant) {
      return res.status(400).send('The other party cannot be found in the conversation.');
    }

    // عرض المحادثة والرسائل
    res.render('chat', {
      conversation: conv,
      messages: msgs,
      user: req.user,
      otherUser: otherParticipant,
      student: student,  // تمرير الطالب إلى العرض
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('A server error occurred.');
  }
};





