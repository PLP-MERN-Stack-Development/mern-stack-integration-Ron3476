const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  author: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  featuredImage: { type: String },
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('Post', PostSchema);
