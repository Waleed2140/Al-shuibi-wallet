const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// قاعدة بيانات مؤقتة متصلة بالذاكرة لتخزين العمليات والمستخدمين
let users = [
    { id: 1, name: "عبدالله احمد قائد المسلمي", username: "abdullah_886", phone: "7777777777", balance: 50000, status: "نشط / موثق" }
];

let transactions = [
    { transId: "TX-1001", type: "تحويل مالي", sender: "abdullah_886", receiver: "user_9921", amount: 1500, date: "2026-10-19", receipt: "سند_صرف_1001.pdf" }
];

let agents = [
    { id: 1, agentName: "Tamkeen Bank", code: "AG-1", balance: 500000, status: "نشط" }
];

// مسار جلب المستخدمين
app.get('/api/admin/users', (req, res) => {
    res.json({ status: "success", users });
});

// مسار تسجيل مستخدم/عميل جديد وتوليد الحسابات تلقائياً
app.post('/api/admin/register-client', (req, res) => {
    const { name, phone, branch } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ status: "error", message: "الاسم ورقم الهاتف مطلوبان" });
    }

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const username = "user_" + randomId;
    const accountNumber = phone + "-" + (800 + Number(branch || 1));
    const tempPass = "Pass@" + Math.floor(100 + Math.random() * 900);
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = {
        id: users.length + 1,
        name,
        username,
        phone,
        accountNumber,
        balance: 0,
        status: "قيد التوثيق",
        tempPass,
        otpCode
    };

    users.push(newUser);

    res.json({
        status: "success",
        message: `تم إنشاء الحساب بنجاح! اسم المستخدم: ${username} | رقم الحساب: ${accountNumber}`,
        user: newUser
    });
});

// مسار جلب الحركات المالية
app.get('/api/admin/transactions', (req, res) => {
    res.json({ status: "success", transactions });
});

// مسار تنفيذ التسوية أو الحوالة
app.post('/api/admin/transaction', (req, res) => {
    const { sender, receiver, amount } = req.body;
    if (!sender || !receiver || !amount) {
        return res.status(400).json({ status: "error", message: "جميع حقول التسوية مطلوبة" });
    }

    const newTrans = {
        transId: "TX-" + Math.floor(1000 + Math.random() * 9000),
        type: "تسوية حسابات",
        sender,
        receiver,
        amount: Number(amount),
        date: new Date().toISOString().split('T')[0],
        receipt: "سند_تسوية_" + Math.floor(100 + Math.random() * 900) + ".pdf"
    };

    transactions.push(newTrans);
    res.json({ status: "success", message: "تم تنفيذ التسوية وإصدار السند بنجاح!", transaction: newTrans });
});

app.get('/api/admin/agents', (req, res) => {
    res.json({ status: "success", agents });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
