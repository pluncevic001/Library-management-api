const { Reservation, Book, User } = require('../models/index');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Get all reservations (admin/librarian vide sve, member vidi samo svoje)
const getAllReservations = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};

        // Member vidi samo svoje rezervacije
        if (req.user.role === 'member') {
            where.userId = req.user.id;
        }

        if (status) {
            where.status = status;
        }

        const { count, rows } = await Reservation.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn', 'availableCopies'] }
            ]
        });

        res.status(200).json(new ApiResponse(200, {
            reservations: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        }, 'Reservations fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Get single reservation
const getReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn'] }
            ]
        });

        if (!reservation) {
            throw new ApiError(404, 'Reservation not found');
        }

        // Member moze videti samo svoje rezervacije
        if (req.user.role === 'member' && reservation.userId !== req.user.id) {
            throw new ApiError(403, 'Not authorized to access this reservation');
        }

        res.status(200).json(new ApiResponse(200, { reservation }, 'Reservation fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Create reservation
const createReservation = async (req, res, next) => {
    try {
        const { bookId } = req.body;

        // Proveri da li knjiga postoji
        const book = await Book.findByPk(bookId);
        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        // Proveri da li user vec ima pending rezervaciju za ovu knjigu
        const existingReservation = await Reservation.findOne({
            where: {
                userId: req.user.id,
                bookId,
                status: 'pending'
            }
        });

        if (existingReservation) {
            throw new ApiError(400, 'You already have a pending reservation for this book');
        }

        // Kreiraj rezervaciju
        const reservation = await Reservation.create({
            userId: req.user.id,
            bookId,
            status: 'pending'
        });

        // Vrati rezervaciju sa detaljima
        const reservationWithDetails = await Reservation.findByPk(reservation.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn'] }
            ]
        });

        res.status(201).json(new ApiResponse(201, { reservation: reservationWithDetails }, 'Reservation created successfully'));
    } catch (error) {
        next(error);
    }
};

// Cancel reservation
const cancelReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);

        if (!reservation) {
            throw new ApiError(404, 'Reservation not found');
        }

        // Samo vlasnik rezervacije moze da je otkaze
        if (req.user.role === 'member' && reservation.userId !== req.user.id) {
            throw new ApiError(403, 'Not authorized to cancel this reservation');
        }

        // Proveri da li je vec otkazana ili ispunjena
        if (reservation.status !== 'pending') {
            throw new ApiError(400, 'Reservation is already fulfilled or cancelled');
        }

        // Oznaci kao cancelled
        await reservation.update({ status: 'cancelled' });

        // Vrati rezervaciju sa detaljima
        const reservationWithDetails = await Reservation.findByPk(reservation.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn'] }
            ]
        });

        res.status(200).json(new ApiResponse(200, { reservation: reservationWithDetails }, 'Reservation cancelled successfully'));
    } catch (error) {
        next(error);
    }
};

// Fulfill reservation (librarian/admin only)
const fulfillReservation = async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);

        if (!reservation) {
            throw new ApiError(404, 'Reservation not found');
        }

        if (reservation.status !== 'pending') {
            throw new ApiError(400, 'Reservation is not pending');
        }

        // Oznaci kao fulfilled
        await reservation.update({ status: 'fulfilled' });

        // Vrati rezervaciju sa detaljima
        const reservationWithDetails = await Reservation.findByPk(reservation.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn'] }
            ]
        });

        res.status(200).json(new ApiResponse(200, { reservation: reservationWithDetails }, 'Reservation fulfilled successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllReservations, getReservation, createReservation, cancelReservation, fulfillReservation };