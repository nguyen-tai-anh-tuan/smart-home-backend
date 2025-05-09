const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Để xử lý CORS
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Cho phép frontend gọi API từ domain khác

// Kết nối MongoDB
const MONGODB_URI = 'mongodb+srv://smarthomeuser:yourpassword123@cluster0.<random>.mongodb.net/smart-home?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Định nghĩa schema cho user
const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String, // Lưu ý: Nên mã hóa mật khẩu trong thực tế
});
const User = mongoose.model('User', userSchema);

// Route test
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Route đăng ký
app.post('/api/signup', async (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;
    if (!fullname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ message: 'Email không hợp lệ!' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự!' });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp!' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại!' });
        }
        const user = new User({ fullname, email, password });
        await user.save();
        res.json({ message: 'Đăng ký thành công!', user: { fullname, email } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server!', error: error.message });
    }
});

// Route đăng nhập
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu!' });
    }

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng!' });
        }
        res.json({ message: 'Đăng nhập thành công!', user: { email } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server!', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});