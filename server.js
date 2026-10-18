const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// استيراد بيانات وإعدادات النظام المحدثة
const { 
    users, 
    agents, 
    transactions, 
    systemSettings, 
    getUserByEmail, 
    getUserById 
} = require('./database');

app.use(express.json());

// 1. مسار الترحيب والتأكد من تشغيل الخادم
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "مرحباً بك في نظام إدارة محفظة الشعيبي (WAL-ADMIN)"
    });
});

// ==========================================
// 👤 قسم إدارة العملاء والتوثيق (KYC)
// ==========================================

// جلب قائمة العملاء كاملة مع حالات التوثيق
app.get('/api/admin/users', (req, res) => {
    res.json({ status: "success", users });
});

// تسجيل عميل جديد من قبل النظام أو الوكيل
app.post('/api/admin/register-client', (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ status: "error", message: "جميع الحقول مطلوبة" });
    }

    // توليد كود OTP وكلمة سر مؤقتة عشوائية
    const tempPassword = "Pass@" + Math.floor(1000 + Math.random() * 9000);
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = {
        id: users.length + 1,
        name,
        email,
        phone,
        role: "customer",
        balance: 0,
        status: "pending", // قيد التوثيق
        documents: {},
        otpCode,
        tempPassword
    };

    users.push(newUser);

    res.json({
        status: "success",
        message: "تم تسجيل العميل بنجاح وتوليد بيانات الاعتماد",
        user: newUser,
        smsNotification: `تم إرسال كود التحقق [${otpCode}] وكلمة السر المؤقتة [${tempPassword}] إلى الرقم ${phone}`
    });
});

// رفع وتحديث الوثائق (صورة الهوية / الجواز)
app.post('/api/admin/upload-docs', (req, res) => {
    const { userId, idCardFront, idCardBack } = req.body;
    const user = getUserById(Number(userId));

    if (!user) {
        return res.status(404).json({ status: "error", message: "العميل غير موجود" });
    }

    user.documents = { idCardFront, idCardBack };
    res.json({ status: "success", message: "تم رفع الوثائق بنجاح وهو بانتظار المراجعة", user });
});

// اعتماد وتوثيق الحساب (قبول / رفض)
app.post('/api/admin/verify-user', (req, res) => {
    const { userId, action } = req.body; // action: 'verify' or 'reject'
    const user = getUserById(Number(userId));

    if (!user) {
        return res.status(404).json({ status: "error", message: "العميل غير موجود" });
    }

    if (action === 'verify') {
        user.status = "verified";
        res.json({ status: "success", message: "تم توثيق وتفعيل حساب العميل بنجاح", user });
    } else {
        user.status = "rejected";
        res.json({ status: "success", message: "تم رفض توثيق الحساب", user });
    }
});

// ==========================================
// 💸 قسم العمليات المالية (إيداع / سحب / تحويل / مؤيدات)
// ==========================================

// جلب جميع الحركات المالية ومؤيدات الصرف
app.get('/api/admin/transactions', (req, res) => {
    res.json({ status: "success", transactions });
});

// تسجيل عملية مالية جديدة (إيداع / سحب / تحويل)
app.post('/api/admin/transaction', (req, res) => {
    const { type, senderEmail, receiverEmail, amount, receiptDocument } = req.body;

    const sender = getUserByEmail(senderEmail);
    const receiver = getUserByEmail(receiverEmail);

    if (type === 'transfer') {
        if (!sender || !receiver) {
            return res.status(404).json({ status: "error", message: "المُرسل أو المستلم غير موجود" });
        }
        if (sender.balance < amount) {
            return res.status(400).json({ status: "error", message: "الرصيد غير كافٍ" });
        }
        sender.balance -= amount;
        receiver.balance += amount;
    }

    const newTrans = {
        transId: "TX-" + (transactions.length + 1001),
        type,
        sender: sender ? sender.name : "إيداع خارجي",
        receiver: receiver ? receiver.name : "سحب خارجي",
        amount,
        status: "completed",
        date: new Date().toISOString().split('T')[0],
        receiptDocument: receiptDocument || "سند_افتراضي.pdf" // مؤيد الصرف
    };

    transactions.push(newTrans);
    res.json({ status: "success", message: "تمت العملية وتسجيل مؤيد الصرف بنجاح", transaction: newTrans });
});

// ==========================================
// 🏢 قسم الوكلاء وإعدادات النظام
// ==========================================

app.get('/api/admin/agents', (req, res) => {
    res.json({ status: "success", agents });
});

app.get('/api/admin/settings', (req, res) => {
    res.json({ status: "success", settings: systemSettings });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`خادم المحفظة الإداري يعمل على المنفذ: ${PORT}`);
});
