import { useState } from "react"

const BlogForm = ({setBlogs, showNotification, blogService}) => {
    const [blog, setBlog] = useState({
        title:'',
        author:'',
        url:''
    })
    const handleBlogCreation = async(event) => {
        event.preventDefault()
        try{
            const createdBlog = await blogService.createBlog(blog)
            setBlogs((prevblogs) => [createdBlog, ...prevblogs])
            showNotification(`A new blog ${createdBlog.title} by ${createdBlog.author} has been added!!!`,'success')
        }catch(error){
            showNotification(`X__X  Failed to create a blog: ${error.response.data.error}`,'error')
        }
        setBlog({title: '', author: '', url: ''})
    }
    return(
        <div>
        <h2>Create a Blog</h2>
        <form onSubmit={handleBlogCreation}>
            <div>
                title
                <input
                    type="text"
                    value={blog.title}
                    onChange={({ target }) => setBlog((blog) => ({...blog, title: target.value}))}
                />
            </div>
            <div>
                author
                <input
                    type="text"
                    value={blog.author}
                    onChange={({ target }) => setBlog((blog) => ({...blog, author: target.value}))}
                />
            </div>
            <div>
                url
                <input
                    type="text"
                    value={blog.url}
                    onChange={({ target }) => setBlog((blog) => ({...blog, url: target.value}))}
                />
            </div>
            <button type="submit">Create</button>
        </form>
        </div>  
    )
}
  
export default BlogForm