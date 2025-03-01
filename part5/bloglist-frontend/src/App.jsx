import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Notifications from './components/Notifications'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('users')) || null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, type: 'success' })
 useEffect(() => {
    if (user) {
      blogService.setToken(user.token) // Set token after login
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }, [user])

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
  }
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: 'success' }), 4000);
  };
  if (user === null) {
    return <LoginForm setUser={setUser} />
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notifications message={notification.message} type={notification.type}/>
      <p>{user.username} logged in</p>
      {user ? (
        <div>
          <button onClick={handleLogout}>Log Out</button>
          <BlogForm setBlogs={setBlogs} blogService={blogService} showNotification={showNotification}/>
        </div>
      ) : (
        <></>
      )}
      {blogs.map((blog) => (
        <div key={blog.id}>
          {blog.title} {blog.author}
        </div>
      ))}
    </div>
  )
}

export default App
