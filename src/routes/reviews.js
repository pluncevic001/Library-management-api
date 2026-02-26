const express = require('express');
const { getBookReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/books/{bookId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews for a book
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Reviews fetched successfully (includes average rating)
 *       404:
 *         description: Book not found
 */
router.get('/books/:bookId/reviews', getBookReviews);

/**
 * @swagger
 * /api/v1/books/{bookId}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Great book! Highly recommended."
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Already reviewed this book
 *       404:
 *         description: Book not found
 */
router.post('/books/:bookId/reviews', protect, createReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review (owner only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         description: Review not found
 */
router.put('/reviews/:id', protect, updateReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review (owner or admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       403:
 *         description: Not authorized to delete this review
 *       404:
 *         description: Review not found
 */
router.delete('/reviews/:id', protect, deleteReview);

module.exports = router;