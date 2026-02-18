const express = require('express');
const { getBookReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book review management
 */

const router = express.Router();

// Review routes
router.get('/books/:bookId/reviews', getBookReviews);
router.post('/books/:bookId/reviews', protect, createReview);
router.put('/reviews/:id', protect, updateReview);
router.delete('/reviews/:id', protect, deleteReview);

module.exports = router;