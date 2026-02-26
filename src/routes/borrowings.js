const express = require('express');
const { getAllBorrowings, getBorrowing, borrowBook, returnBook } = require('../controllers/borrowingController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Sve rute zahtevaju autentikaciju
router.use(protect);

/**
 * @swagger
 * /api/v1/borrowings:
 *   get:
 *     tags: [Borrowings]
 *     summary: Get all borrowings (Admin/Librarian see all, Members see only their own)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, returned, overdue]
 *         description: Filter by status
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
 *         description: Borrowings fetched successfully
 *       401:
 *         description: Not authorized
 */
router.get('/', getAllBorrowings);

/**
 * @swagger
 * /api/v1/borrowings/{id}:
 *   get:
 *     tags: [Borrowings]
 *     summary: Get borrowing by ID
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
 *         description: Borrowing fetched successfully
 *       404:
 *         description: Borrowing not found
 */
router.get('/:id', getBorrowing);

/**
 * @swagger
 * /api/v1/borrowings:
 *   post:
 *     tags: [Borrowings]
 *     summary: Borrow a book
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *       400:
 *         description: Book not available or already borrowed
 *       404:
 *         description: Book not found
 */
router.post('/', borrowBook);

/**
 * @swagger
 * /api/v1/borrowings/{id}/return:
 *   patch:
 *     tags: [Borrowings]
 *     summary: Return a borrowed book
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
 *         description: Book returned successfully
 *       400:
 *         description: Book already returned
 *       404:
 *         description: Borrowing not found
 */
router.patch('/:id/return', returnBook);

module.exports = router;