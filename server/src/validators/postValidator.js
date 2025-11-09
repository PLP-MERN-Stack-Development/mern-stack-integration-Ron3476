const { body } = require('express-validator');

exports.createPost = [
  body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 chars'),
  body('content').isLength({ min: 10 }).withMessage('Content must be at least 10 chars'),
];
