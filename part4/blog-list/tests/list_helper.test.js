const { describe, test } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

const blogs = [
  {
    _id: '1',
    title: 'First Blog',
    author: 'John Doe',
    url: 'http://example.com/1',
    likes: 10,
  },
  {
    _id: '2',
    title: 'Second Blog',
    author: 'Jane Doe',
    url: 'http://example.com/2',
    likes: 15,
  },
  {
    _id: '3',
    title: 'Third Blog',
    author: 'John Doe',
    url: 'http://example.com/3',
    likes: 7,
  },
];

// Dummy Test
test('dummy returns one', () => {
  const result = listHelper.dummy([]);
  assert.strictEqual(result, 1);
});

// Total Likes Test
describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes([blogs[0]]);
    assert.strictEqual(result, 10);
  });

  test('calculates total likes of multiple blogs', () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 32);
  });

  test('returns 0 for an empty list', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });
});

// Favorite Blog Test
describe('favorite blog', () => {
  test('finds the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: 'Second Blog',
      author: 'Jane Doe',
      likes: 15,
    });
  });

  test('returns null for an empty list', () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });
});

// Most Blogs Test
describe('most blogs', () => {
  test('identifies the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, { author: 'John Doe', blogs: 2 });
  });

  test('returns null for an empty list', () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });
});

// Most Likes Test
describe('most likes', () => {
  test('identifies the author with the most total likes', () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, { author: 'John Doe', likes: 17 });
  });

  test('returns null for an empty list', () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });
});
