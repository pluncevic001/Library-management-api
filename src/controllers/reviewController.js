const { Review, Book, User } = require('../models/index');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Get all reviews for a book
const getBookReviews = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const book = await Book.findByPk(bookId);
        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        const { count, rows } = await Review.findAndCountAll({
            where: { bookId },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, attributes: ['id', 'name'] }
            ]
        });

        // Izracunaj prosecnu ocenu
        const averageRating = rows.length > 0 
            ? rows.reduce((sum, review) => sum + review.rating, 0) / rows.length 
            : 0;

        res.status(200).json(new ApiResponse(200, {
            reviews: rows,
            averageRating: averageRating.toFixed(1),
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        }, 'Reviews fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Create a review
const createReview = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { rating, comment } = req.body;

        // Proveri da li knjiga postoji
        const book = await Book.findByPk(bookId);
        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        // Proveri da li user vec ima recenziju za ovu knjigu
        const existingReview = await Review.findOne({
            where: { userId: req.user.id, bookId }
        });

        if (existingReview) {
            throw new ApiError(400, 'You have already reviewed this book');
        }

        // Kreiraj recenziju
        const review = await Review.create({
            userId: req.user.id,
            bookId,
            rating,
            comment
        });

        // Vrati recenziju sa detaljima
        const reviewWithDetails = await Review.findByPk(review.id, {
            include: [
                { model: User, attributes: ['id', 'name'] },
                { model: Book, attributes: ['id', 'title'] }
            ]
        });

        res.status(201).json(new ApiResponse(201, { review: reviewWithDetails }, 'Review created successfully'));
    } catch (error) {
        next(error);
    }
};

// Update review
const updateReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            throw new ApiError(404, 'Review not found');
        }

        // Samo vlasnik recenzije moze da je update-uje
        if (review.userId !== req.user.id) {
            throw new ApiError(403, 'Not authorized to update this review');
        }

        const { rating, comment } = req.body;

        await review.update({
            rating: rating || review.rating,
            comment: comment || review.comment
        });

        // Vrati azuriranu recenziju
        const updatedReview = await Review.findByPk(review.id, {
            include: [
                { model: User, attributes: ['id', 'name'] },
                { model: Book, attributes: ['id', 'title'] }
            ]
        });

        res.status(200).json(new ApiResponse(200, { review: updatedReview }, 'Review updated successfully'));
    } catch (error) {
        next(error);
    }
};

// Delete review
const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);

        if (!review) {
            throw new ApiError(404, 'Review not found');
        }

        // Samo vlasnik recenzije ili admin moze da je obrise
        if (review.userId !== req.user.id && req.user.role !== 'admin') {
            throw new ApiError(403, 'Not authorized to delete this review');
        }

        await review.destroy();

        res.status(200).json(new ApiResponse(200, null, 'Review deleted successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getBookReviews, createReview, updateReview, deleteReview };