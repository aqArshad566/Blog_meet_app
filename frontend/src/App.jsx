import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Blog from './Blog';
import AddBlog from './AddBlog';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <Link to="/signup" className="nav-link">Signup</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/blogs" className="nav-link">Blogs</Link>
          <Link to="/add-blog" className="nav-link">Add Blog</Link>
        </nav>
        <div className="app-content">
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/blogs" component={Blog} />
            <Route path="/add-blog" component={AddBlog} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;