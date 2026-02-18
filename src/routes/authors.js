const express = require('express');
const { getAllAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor } = require('../controllers/authorController');
const { protect, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

const router = express.Router();

router.get('/', getAllAuthors);
router.get('/:id', getAuthor);
router.post('/', protect, authorize('admin', 'librarian'), createAuthor);
router.put('/:id', protect, authorize('admin', 'librarian'), updateAuthor);
router.delete('/:id', protect, authorize('admin', 'librarian'), deleteAuthor);

module.exports = router;