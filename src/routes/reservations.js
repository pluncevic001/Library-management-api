const express = require('express');
const { getAllReservations, getReservation, createReservation, cancelReservation, fulfillReservation } = require('../controllers/reservationController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Sve rute zahtevaju autentikaciju
router.use(protect);

/**
 * @swagger
 * /api/v1/reservations:
 *   get:
 *     tags: [Reservations]
 *     summary: Get all reservations (Admin/Librarian see all, Members see only their own)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, fulfilled, cancelled]
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
 *         description: Reservations fetched successfully
 *       401:
 *         description: Not authorized
 */
router.get('/', getAllReservations);

/**
 * @swagger
 * /api/v1/reservations/{id}:
 *   get:
 *     tags: [Reservations]
 *     summary: Get reservation by ID
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
 *         description: Reservation fetched successfully
 *       404:
 *         description: Reservation not found
 */
router.get('/:id', getReservation);

/**
 * @swagger
 * /api/v1/reservations:
 *   post:
 *     tags: [Reservations]
 *     summary: Create a reservation for a book
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
 *         description: Reservation created successfully
 *       400:
 *         description: Already have pending reservation for this book
 *       404:
 *         description: Book not found
 */
router.post('/', createReservation);

/**
 * @swagger
 * /api/v1/reservations/{id}/cancel:
 *   patch:
 *     tags: [Reservations]
 *     summary: Cancel a reservation
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
 *         description: Reservation cancelled successfully
 *       400:
 *         description: Reservation already fulfilled or cancelled
 *       404:
 *         description: Reservation not found
 */
router.patch('/:id/cancel', cancelReservation);

/**
 * @swagger
 * /api/v1/reservations/{id}/fulfill:
 *   patch:
 *     tags: [Reservations]
 *     summary: Fulfill a reservation (Admin/Librarian only)
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
 *         description: Reservation fulfilled successfully
 *       400:
 *         description: Reservation not pending
 *       404:
 *         description: Reservation not found
 */
router.patch('/:id/fulfill', authorize('admin', 'librarian'), fulfillReservation);

module.exports = router;