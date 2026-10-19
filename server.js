const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// قراءة الملفات الثابتة والصفحة الرئيسية
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// قائمة تخزين الطلبات الواردة من تطبيق العملاء الخارجي
let clientRequests = [];

app.post('/api/client/submit-remittance', (req, res) => {
    const { accountNumber, clientName, remittanceNum, serviceName, amount, currency } = req.body;
    
    if (!accountNumber || !remittanceNum) {
        return res.status(400).json({ status: "error", message: "رقم الحساب ورقم الحوالة مطلوبان" });
    }

    const newRequest = {
        orderId: Math.floor(10000000 + Math.random() * 90000000),
        date: new Date().toLocaleDateString('ar-EG'),
        accountNumber,
        clientName: clientName || "عميل تطبيق",
        remittanceNum,
        serviceName: serviceName || "حوالة عامة",
        status: "معلق"
    };

    clientRequests.push(newRequest);

    res.json({
        status: "success",
        message: "تم إرسال طلب الحوالة بنجاح وهو قيد المراجعة.",
        orderId: newRequest.orderId
    });
});

app.get('/api/admin/get-requests', (req, res) => {
    res.json({ status: "success", requests: clientRequests });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
