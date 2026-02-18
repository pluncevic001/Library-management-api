const { Borrowing, Book, User } = require('../models/index');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { Op } = require('sequelize');

// Get all borrowings (admin/librarian vide sve, member vidi samo svoje)
const getAllBorrowings = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};

        // Member vidi samo svoje pozajmice
        if (req.user.role === 'member') {
            where.userId = req.user.id;
        }

        if (status) {
            where.status = status;
        }

        const { count, rows } = await Borrowing.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn'] }
            ]
        });

        res.status(200).json(new ApiResponse(200, {
            borrowings: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        }, 'Borrowings fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Get single borrowing
const getBorrowing = async (req, res, next) => {
    try {
        const borrowing = await Borrowing.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn'] }
            ]
        });

        if (!borrowing) {
            throw new ApiError(404, 'Borrowing not found');
        }

        // Member moze videti samo svoje pozajmice
        if (req.user.role === 'member' && borrowing.userId !== req.user.id) {
            throw new ApiError(403, 'Not authorized to access this borrowing');
        }

        res.status(200).json(new ApiResponse(200, { borrowing }, 'Borrowing fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Borrow a book (pozajmi knjigu)
const borrowBook = async (req, res, next) => {
    try {
        const { bookId } = req.body;

        // Proveri da li knjiga postoji
        const book = await Book.findByPk(bookId);
        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        // Proveri da li knjiga ima dostupne kopije
        if (book.availableCopies <= 0) {
            throw new ApiError(400, 'Book is not available for borrowing');
        }

        // Proveri da li korisnik vec ima aktivnu pozajmicu ove knjige
        const existingBorrowing = await Borrowing.findOne({
            where: {
                userId: req.user.id,
                bookId,
                status: 'active'
            }
        });

        if (existingBorrowing) {
            throw new ApiError(400, 'You already have an active borrowing for this book');
        }

        // Kreiraj pozajmicu (rok 14 dana)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const borrowing = await Borrowing.create({
            userId: req.user.id,
            bookId,
            dueDate,
            status: 'active'
        });

        // Smanji broj dostupnih kopija
        await book.update({ availableCopies: book.availableCopies - 1 });

        // Vrati pozajmicu sa detaljima
        const borrowingWithDetails = await Borrowing.findByPk(borrowing.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn'] }
            ]
        });

        res.status(201).json(new ApiResponse(201, { borrowing: borrowingWithDetails }, 'Book borrowed successfully'));
    } catch (error) {
        next(error);
    }
};

// Return a book (vrati knjigu)
const returnBook = async (req, res, next) => {
    try {
        const borrowing = await Borrowing.findByPk(req.params.id);

        if (!borrowing) {
            throw new ApiError(404, 'Borrowing not found');
        }

        // Samo vlasnik pozajmice ili admin/librarian moze vratiti knjigu
        if (req.user.role === 'member' && borrowing.userId !== req.user.id) {
            throw new ApiError(403, 'Not authorized to return this borrowing');
        }

        // Proveri da li je knjiga vec vracena
        if (borrowing.status === 'returned') {
            throw new ApiError(400, 'Book already returned');
        }

        // Oznaci kao vracenu
        await borrowing.update({
            returnedAt: new Date(),
            status: 'returned'
        });

        // Povecaj broj dostupnih kopija
        const book = await Book.findByPk(borrowing.bookId);
        await book.update({ availableCopies: book.availableCopies + 1 });

        // Vrati pozajmicu sa detaljima
        const borrowingWithDetails = await Borrowing.findByPk(borrowing.id, {
            include: [
                { model: User, attributes: ['id', 'name', 'email'] },
                { model: Book, attributes: ['id', 'title', 'isbn'] }
            ]
        });

        res.status(200).json(new ApiResponse(200, { borrowing: borrowingWithDetails }, 'Book returned successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllBorrowings, getBorrowing, borrowBook, returnBook };