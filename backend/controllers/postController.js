const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

const getPosts = async (req, res) => {
  try {
    const { keyword, category, page = 1, limit = 6 } = req.query;

    const query = { status: 'Published' };

    if (keyword) {
      query.$text = { $search: keyword };
    }

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .populate('author', 'name')
      .populate('category', 'name slug')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.status(200).json({
      posts,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name')
      .populate('category', 'name slug');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createPost = async (req, res) => {
  try {
    const { title, subtitle, content, coverImage, status, category, tags } = req.body;

    const post = await Post.create({
      title,
      subtitle,
      content,
      coverImage,
      status,
      category,
      tags,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this post' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    // Also remove all comments related to this post
    await Comment.deleteMany({ post: req.params.id });

    res.status(200).json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      // Unlike
      post.likes = post.likes.filter((likeId) => likeId.toString() !== req.user._id.toString());
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json(post.likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      text,
      author: req.user._id,
      post: req.params.id,
    });

    const populatedComment = await comment.populate('author', 'name');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getComments,
  addComment
};
