const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createPost } = require('../validators/postValidator');

// GET /api/posts?search=&page=1&limit=10&category=
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { content: new RegExp(search, 'i') }
    ];
    if (category) filter.categories = category;

    const posts = await Post.find(filter)
      .populate('categories')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(filter);
    res.json({ data: posts, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) { next(err); }
});

// GET /api/posts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('categories');
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) { next(err); }
});

// POST /api/posts
router.post('/', auth, upload.single('featuredImage'), createPost, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const postData = {
      title: req.body.title,
      slug: (req.body.slug || req.body.title).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      content: req.body.content,
      author: req.user.id,
      categories: req.body.categories ? req.body.categories.split(',') : [],
    };

    if (req.file) postData.featuredImage = `/uploads/${req.file.filename}`;

    const post = new Post(postData);
    await post.save();
    res.status(201).json(post);
  } catch (err) { next(err); }
});

// PUT /api/posts/:id
router.put('/:id', auth, upload.single('featuredImage'), createPost, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const update = {
      title: req.body.title,
      content: req.body.content,
      categories: req.body.categories ? req.body.categories.split(',') : [],
      updatedAt: Date.now()
    };
    if (req.file) update.featuredImage = `/uploads/${req.file.filename}`;

    // allow comments patch using comments array in body (simple)
    if (req.body.comments) update.comments = req.body.comments;

    const updated = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
