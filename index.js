const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🧠 تخزين مؤقت
let messages = [];
let users = [];

// 🟢 صفحة ترحيبية
app.get('/', (req, res) => {
  res.send('🚀 dew-server is live and ready for chat!');
});

// 🟢 رفع وسائط
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

// 🟢 تسجيل مستخدم جديد
app.post('/users', (req, res) => {
  const { email, name } = req.body;
  console.log(`🟢 تسجيل: ${email} - ${name}`);

  if (!email || !name) {
    return res.status(400).json({ error: 'Missing email or name' });
  }

  const exists = users.find(u => u.email === email);
  if (!exists) {
    users.push({ email, name });
  }

  res.json({ status: 'User saved', email, name });
});

// 🟢 البحث عن مستخدم
app.get('/users', (req, res) => {
  const { email } = req.query;

  const user = users.find(u => u.email === email);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// ✅ عرض كل المستخدمين (جديد)
app.get('/users/all', (req, res) => {
  res.json(users);
});

// 🟢 إرسال رسالة
app.post('/messages', (req, res) => {
  const { text, sender, receiver, timestamp, mediaUrl, mediaType } = req.body;

  if (!sender || !receiver || !timestamp) {
    return res.status(400).json({ error: 'Missing sender, receiver, or timestamp' });
  }

  const msg = { text, sender, receiver, timestamp, mediaUrl, mediaType };
  messages.push(msg);
  res.json({ status: 'Message saved', msg });
});

// 🟢 جلب الرسائل
app.get('/messages', (req, res) => {
  res.json(messages);
});

// 🟢 حذف الرسائل
app.delete('/messages', (req, res) => {
  messages = [];
  res.json({ status: 'All messages deleted' });
});

// 🟢 تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
