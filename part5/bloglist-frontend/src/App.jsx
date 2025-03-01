import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('users')) || null)
  const [blogs, setBlogs] = useState([])

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
  console.dir(user)
  if (user === null) {
    return <LoginForm setUser={setUser} />
  }
  return (
    <div>
      <h2>blogs</h2>
      <p>{user.username} logged in</p>
      {user ? (
        <button onClick={handleLogout}>Log Out</button>
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
