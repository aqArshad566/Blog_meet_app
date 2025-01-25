const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./db');

const app = express();
app.use(bodyParser.json());

connectDB();

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const BlogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
});

const CommentSchema = new mongoose.Schema({
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const Blog = mongoose.model('Blog', BlogSchema);
const Comment = mongoose.model('Comment', CommentSchema);

const secretKey = 'your_secret_key';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Endpoint to sign up a new user
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ message: 'User already exists' });
    }
});

// Endpoint to login and get a token
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.sendStatus(403);

    const token = jwt.sign({ id: user._id, username: user.username }, secretKey);
    res.json({ token });
});

// Endpoint to create a new blog
app.post('/blogs', authenticateToken, async (req, res) => {
    const blog = new Blog({ userId: req.user.id, title: req.body.title, content: req.body.content });
    await blog.save();
    res.status(201).json(blog);
});

// Endpoint to add a comment to a blog
app.post('/blogs/:blogId/comments', authenticateToken, async (req, res) => {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.sendStatus(404);

    const comment = new Comment({ blogId: blog._id, userId: req.user.id, content: req.body.content });
    await comment.save();
    res.status(201).json(comment);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});