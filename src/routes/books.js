const express = require('express');
const { getAllBooks, getBook, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books with filters and pagination
 *     parameters:
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Books fetched successfully
 */
router.get('/', getAllBooks);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book fetched successfully
 *       404:
 *         description: Book not found
 */
router.get('/:id', getBook);

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     tags: [Books]
 *     summary: Create a new book (Admin/Librarian only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *               - totalCopies
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               description:
 *                 type: string
 *               totalCopies:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               authorIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               publishedYear:
 *                 type: integer
 *               language:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *       403:
 *         description: Not authorized
 */
router.post('/', protect, authorize('admin', 'librarian'), createBook);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update book (Admin/Librarian only)
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
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 */
router.put('/:id', protect, authorize('admin', 'librarian'), updateBook);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete book (Admin/Librarian only)
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
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete('/:id', protect, authorize('admin', 'librarian'), deleteBook);

module.exports = router;