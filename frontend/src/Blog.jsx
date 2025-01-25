import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await axios.get('http://localhost:3000/blogs');
      setBlogs(response.data);
    };
    fetchBlogs();
  }, []);

  const handleCommentSubmit = async (blogId) => {
    const token = localStorage.getItem('token');
    await axios.post(`http://localhost:3000/blogs/${blogId}/comments`, { content: comment }, {
      headers: { Authorization: token }
    });
    setComment('');
    alert('Comment added');
  };

  return (
    <div className="blog-container">
      <h2>Blogs</h2>
      {blogs.map(blog => (
        <div key={blog._id} className="blog-item">
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          <form onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(blog._id); }}>
            <input
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="comment-input"
              required
            />
            <button type="submit" className="comment-button">Comment</button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default Blog;