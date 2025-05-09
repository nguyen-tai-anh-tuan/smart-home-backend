const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Để parse JSON từ request

// Route cơ bản
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Route mẫu cho đăng nhập (chỉ là demo)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        res.json({ message: 'Đăng nhập thành công!', user: { email } });
    } else {
        res.status(400).json({ message: 'Thiếu email hoặc mật khẩu!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post('/api/signup', (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;
    if (!fullname || !email || !password || !confirmPassword) {
        res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
        return;
    }
    if (!email.includes('@')) {
        res.status(400).json({ message: 'Email không hợp lệ!' });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
        return;
    }
    if (password !== confirmPassword) {
        res.status(400).json({ message: 'Mật khẩu xác nhận không khớp!' });
        return;
    }
    res.json({ message: 'Đăng ký thành công!', user: { fullname, email } });
});