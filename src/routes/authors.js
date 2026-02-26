const express = require('express');
const { getAllAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor } = require('../controllers/authorController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * /api/v1/authors:
 *   get:
 *     tags: [Authors]
 *     summary: Get all authors
 *     responses:
 *       200:
 *         description: Authors fetched successfully
 */
router.get('/', getAllAuthors);

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   get:
 *     tags: [Authors]
 *     summary: Get author by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Author fetched successfully
 *       404:
 *         description: Author not found
 */
router.get('/:id', getAuthor);

/**
 * @swagger
 * /api/v1/authors:
 *   post:
 *     tags: [Authors]
 *     summary: Create a new author (Admin/Librarian only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               bio:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created successfully
 *       403:
 *         description: Not authorized
 */
router.post('/', protect, authorize('admin', 'librarian'), createAuthor);

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   put:
 *     tags: [Authors]
 *     summary: Update author (Admin/Librarian only)
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
 *         description: Author updated successfully
 *       404:
 *         description: Author not found
 */
router.put('/:id', protect, authorize('admin', 'librarian'), updateAuthor);

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   delete:
 *     tags: [Authors]
 *     summary: Delete author (Admin/Librarian only)
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
 *         description: Author deleted successfully
 *       404:
 *         description: Author not found
 */
router.delete('/:id', protect, authorize('admin', 'librarian'), deleteAuthor);

module.exports = router;