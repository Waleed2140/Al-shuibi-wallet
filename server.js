const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// استيراد قاعدة البيانات المؤقتة التي أنشأناها
const { users, getUserByEmail, updateBalance } = require('./database');

app.use(express.json());

// مسار الترحيب
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "مرحباً بك في نظام محفظة الشعيبي (Al shuibi wallet)"
    });
});

// مسار لعرض جميع المستخدمين وأرصدتهم
app.get('/api/users', (req, res) => {
    res.json({
        status: "success",
        users: users
    });
});

// مسار لتحويل الأموال بين المستخدمين
app.post('/api/transfer', (req, res) => {
    const { senderEmail, receiverEmail, amount } = req.body;

    let sender = getUserByEmail(senderEmail);
    let receiver = getUserByEmail(receiverEmail);

    if (!sender || !receiver) {
        return res.status(404).json({ status: "error", message: "المُرسِل أو المُستقبل غير موجود" });
    }

    if (sender.balance < amount) {
        return res.status(400).json({ status: "error", message: "الرصيد غير كافٍ لإتمام العملية" });
    }

    if (amount <= 0) {
        return res.status(400).json({ status: "error", message: "المبلغ المدخل غير صالح" });
    }

    // خصم المبلغ وإضافته
    sender.balance -= amount;
    receiver.balance += amount;

    res.json({
        status: "success",
        message: "تمت عملية التحويل بنجاح",
        senderBalance: sender.balance,
        receiverBalance: receiver.balance
    });
});

app.listen(PORT, () => {
    console.log(`الخادم يعمل حالياً على المنفذ: ${PORT}`);
});
