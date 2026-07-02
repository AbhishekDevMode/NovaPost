const Post = require('../models/Post');
const Comment = require('../models/Comment');

const getAuthorAnalytics = async (req, res) => {
  try {
    const authorId = req.user._id;

    const posts = await Post.find({ author: authorId }).populate('category', 'name');

    const totalPosts = posts.length;
    let totalLikes = 0;
    
    posts.forEach((post) => {
      totalLikes += post.likes.length;
    });

    const postIds = posts.map((post) => post._id);
    const totalComments = await Comment.countDocuments({ post: { $in: postIds } });

    const categoryDistribution = {};
    posts.forEach((post) => {
      if (post.category) {
        const catName = post.category.name;
        if (categoryDistribution[catName]) {
          categoryDistribution[catName]++;
        } else {
          categoryDistribution[catName] = 1;
        }
      }
    });

    const chartData = Object.keys(categoryDistribution).map((key) => ({
      name: key,
      value: categoryDistribution[key],
    }));

    res.status(200).json({
      totalPosts,
      totalLikes,
      totalComments,
      chartData,
      posts, // sending posts along so dashboard can list them
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAuthorAnalytics,
};
