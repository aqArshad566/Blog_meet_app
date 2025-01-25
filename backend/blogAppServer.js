const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

const blogs = [];
const comments = [];
const users = [{ id: 1, username: 'user1', password: 'password1' }];

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

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);
    res.status(201).json({ message: 'User created successfully' });
});

// Endpoint to login and get a token
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.sendStatus(403);

    const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
    res.json({ token });
});

// Endpoint to create a new blog
app.post('/blogs', authenticateToken, (req, res) => {
    const blog = { id: blogs.length + 1, userId: req.user.id, title: req.body.title, content: req.body.content };
    blogs.push(blog);
    res.status(201).json(blog);
});

// Endpoint to add a comment to a blog
app.post('/blogs/:blogId/comments', authenticateToken, (req, res) => {
    const blogId = parseInt(req.params.blogId);
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) return res.sendStatus(404);

    const comment = { id: comments.length + 1, blogId: blog.id, userId: req.user.id, content: req.body.content };
    comments.push(comment);
    res.status(201).json(comment);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});