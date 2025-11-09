const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const cat = new Category({ name: req.body.name });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) { next(err); }
});

module.exports = router;
