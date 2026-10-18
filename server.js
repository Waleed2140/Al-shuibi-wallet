// استدعاء المكتبات الأساسية
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// إعداد النظام لاستقبال بيانات بصيغة JSON
app.use(express.json());

// مسار رئيسي للتأكد أن الخادم يعمل
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "مرحباً بك في نظام محفظة الشعيبي (Al shuibi wallet)"
    });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل حالياً على المنفذ: ${PORT}`);
});
