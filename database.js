// قاعدة بيانات متكاملة لنظام محفظة الشعيبي

// 1. حسابات المستخدمين والعملاء (مع توثيق الوثائق وحالة الحساب)
let users = [
    {
        id: 1,
        name: "أحمد الشعيبي",
        email: "ahmed@wallet.com",
        phone: "770000001",
        role: "admin", // صلاحية مدير النظام
        balance: 50000,
        status: "verified", // موثق
        documents: { idCardFront: "doc1_front.jpg", idCardBack: "doc1_back.jpg" },
        otpCode: null,
        tempPassword: null
    },
    {
        id: 2,
        name: "محمد علي",
        email: "mohammed@wallet.com",
        phone: "770000002",
        role: "customer", // عميل
        balance: 2500,
        status: "pending", // بانتظار التوثيق
        documents: { idCardFront: "doc2_front.jpg", idCardBack: "doc2_back.jpg" },
        otpCode: "4821",
        tempPassword: "Pass@1234"
    }
];

// 2. قائمة الوكلاء المعتمدين
let agents = [
    { id: 101, agentName: "وكالة الشعيبي للصرافة", code: "AG-101", balance: 500000, status: "active" },
    { id: 102, agentName: "مركز النجم للخدمات المالية", code: "AG-102", balance: 250000, status: "active" }
];

// 3. سجل الحركات المالية (حوالات، إيداعات، سحب، ومؤيدات الصرف)
let transactions = [
    {
        transId: "TX-1001",
        type: "transfer", // تحويل / إيداع / سحب
        sender: "أحمد الشعيبي",
        receiver: "محمد علي",
        amount: 1500,
        status: "completed",
        date: "2026-10-18",
        receiptDocument: "receipt_1001.pdf" // مؤيد الصرف / السند
    }
];

// 4. إعدادات النظام والصلاحيات
let systemSettings = {
    minTransferAmount: 100,
    maxTransferAmount: 100000,
    requireOTP: true,
    allowAutoVerification: false
};

// دوال إدارة العملاء والعمليات
function getUserByEmail(email) {
    return users.find(u => u.email === email);
}

function getUserById(id) {
    return users.find(u => u.id === id);
}

module.exports = { 
    users, 
    agents, 
    transactions, 
    systemSettings, 
    getUserByEmail, 
    getUserById 
};
