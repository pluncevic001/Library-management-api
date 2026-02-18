const express = require('express');
const { getAllBorrowings, getBorrowing, borrowBook, returnBook } = require('../controllers/borrowingController');
const { protect, authorize } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Borrowings
 *   description: Book borrowing management
 */

const router = express.Router();

// Sve rute zahtevaju autentikaciju
router.use(protect);

router.get('/', getAllBorrowings);
router.get('/:id', getBorrowing);
router.post('/', borrowBook);
router.patch('/:id/return', returnBook);

module.exports = router;
