const express = require('express');
const { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', protect, authorize('admin', 'librarian'), createCategory);
router.put('/:id', protect, authorize('admin', 'librarian'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'librarian'), deleteCategory);

module.exports = router;