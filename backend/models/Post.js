const mongoose = require('mongoose');
const slugify = require('slugify');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: String,
    subtitle: {
      type: String,
      maxlength: [150, 'Subtitle cannot be more than 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    coverImage: {
      type: String,
      default: 'no-photo.jpg',
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Create post slug from the title before saving
postSchema.pre('save', function () {
  if (!this.isModified('title')) {
    return;
  }
  this.slug = slugify(this.title, { lower: true });
});

// Create text index for search
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
