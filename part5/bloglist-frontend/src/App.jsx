import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

 useEffect(() => {
    if (user) {
      blogService.setToken(user.token) // Set token after login
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }, [user])

  if (user === null) {
    return <LoginForm setUser={setUser} />
  }
  console.log(user);
  return (
    <div>
      <h2>blogs</h2>
      <p>{user.username} logged in</p>
      {blogs.map((blog) => (
        <div key={blog.id}>
          {blog.title} {blog.author}
        </div>
      ))}
    </div>
  )
}

export default App
