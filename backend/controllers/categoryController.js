const Category = require('../models/Category');
const slugify = require('slugify');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide a category name' });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const slug = slugify(name, { lower: true });

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
};
