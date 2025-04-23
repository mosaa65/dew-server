const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let messages = []; // قائمة مؤقتة للرسائل

// إرسال رسالة جديدة
app.post('/messages', (req, res) => {
  const { text, isMe, timestamp } = req.body;
  const msg = { text, isMe, timestamp };
  messages.push(msg);
  res.json({ status: 'Message stored', msg });
});

// جلب جميع الرسائل
app.get('/messages', (req, res) => {
  res.json(messages);
});

// حذف جميع الرسائل
app.delete('/messages', (req, res) => {
  messages = [];
  res.json({ status: 'Messages cleared' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
