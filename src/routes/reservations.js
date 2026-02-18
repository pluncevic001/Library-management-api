const express = require('express');
const { getAllReservations, getReservation, createReservation, cancelReservation, fulfillReservation } = require('../controllers/reservationController');
const { protect, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Book reservation management
 */

const router = express.Router();

// Sve rute zahtevaju autentikaciju
router.use(protect);

router.get('/', getAllReservations);
router.get('/:id', getReservation);
router.post('/', createReservation);
router.patch('/:id/cancel', cancelReservation);
router.patch('/:id/fulfill', authorize('admin', 'librarian'), fulfillReservation);

module.exports = router;