const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getComments,
  addComment
} = require('../controllers/postController');
const { protect, authorOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, authorOnly, createPost);

router.route('/:slug')
  .get(getPostBySlug);

// using ID for update/delete
router.route('/id/:id')
  .put(protect, authorOnly, updatePost)
  .delete(protect, authorOnly, deletePost);

router.route('/:id/like')
  .post(protect, likePost);

router.route('/:id/comments')
  .get(getComments)
  .post(protect, addComment);

module.exports = router;
