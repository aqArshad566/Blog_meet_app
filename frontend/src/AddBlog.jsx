import React, { useState } from 'react';
import axios from 'axios';
import './AddBlog.css';

function AddBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:3000/blogs', { title, content }, {
      headers: { Authorization: token }
    });
    setTitle('');
    setContent('');
    alert('Blog added');
  };

  return (
    <div className="addblog-container">
      <h2>Add Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="addblog-input"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="addblog-textarea"
          required
        />
        <button type="submit" className="addblog-button">Add Blog</button>
      </form>
    </div>
  );
}

export default AddBlog;