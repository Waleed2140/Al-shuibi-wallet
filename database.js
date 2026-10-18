// قاعدة بيانات مؤقتة لتخزين المستخدمين والأرصدة
let users = [
    { id: 1, name: "أحمد الشعيبي", email: "ahmed@wallet.com", balance: 5000 },
    { id: 2, name: "محمد علي", email: "mohammed@wallet.com", balance: 2500 }
];

// دالة لجلب بيانات المستخدم بواسطة البريد الإلكتروني
function getUserByEmail(email) {
    return users.find(u => u.email === email);
}

// دالة لتحديث الرصيد
function updateBalance(email, amount) {
    let user = getUserByEmail(email);
    if (user) {
        user.balance += amount;
        return user;
    }
    return null;
}

module.exports = { users, getUserByEmail, updateBalance };
