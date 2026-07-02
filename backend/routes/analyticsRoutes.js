const express = require('express');
const router = express.Router();
const { getAuthorAnalytics } = require('../controllers/analyticsController');
const { protect, authorOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, authorOnly, getAuthorAnalytics);

module.exports = router;
