const express = require('express');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const User = require('./models/user');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// 注册路由
app.post('/register', [
  body('account').trim().isLength({ min: 3 }).withMessage('账号至少需要3个字符'),
  body('password').isLength({ min: 6 }).withMessage('密码至少需要6个字符')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { account, password } = req.body;

    // 检查账号是否已存在
    const existingUser = await User.findOne({ where: { account } });
    if (existingUser) {
      return res.status(400).json({ error: '该账号已被注册' });
    }

    // 创建新用户
    const user = await User.create({ account, password });
    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登录路由
app.post('/login', async (req, res) => {
  try {
    const { account, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { account } });
    if (!user) {
      return res.status(401).json({ error: '账号或密码错误' });
    }

    // 验证密码
    const isMatch = await User.comparePassword(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ error: '账号或密码错误' });
    }

    res.json({ message: '登录成功' });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`服务器运行在端口 ${port}`);
});