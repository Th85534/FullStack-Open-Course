const _ = require('lodash'); // Using Lodash for more complex operations

// Dummy function (Step 1)
const dummy = (blogs) => {
  return 1;
};

// Total Likes (Step 2)
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

// Favorite Blog (Step 3)
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const favorite = blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  );

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

// Most Blogs (Step 4)
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, 'author');
  const topAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author]);

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  };
};

// Most Likes (Step 5)
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const authorLikes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const authorArray = Object.entries(authorLikes).map(([author, likes]) => ({ author, likes }));

  return _.maxBy(authorArray, 'likes'); // Finds the object with max 'likes'
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
