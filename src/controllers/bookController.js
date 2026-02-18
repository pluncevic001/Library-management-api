const { Book, Category, Author } = require('../models/index');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { Op } = require('sequelize');

// Get all books sa filterima i paginacijom
const getAllBooks = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, available, search, sortBy = 'createdAt', order = 'DESC' } = req.query;

        const offset = (page - 1) * limit;

        // Filters
        const where = {};
        
        if (category) {
            where.categoryId = category;
        }
        
        if (available === 'true') {
            where.availableCopies = { [Op.gt]: 0 };
        }
        
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Book.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, order]],
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Author, attributes: ['id', 'firstName', 'lastName'], through: { attributes: [] } }
            ]
        });

        res.status(200).json(new ApiResponse(200, {
            books: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        }, 'Books fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Get single book
const getBook = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [
                { model: Category, attributes: ['id', 'name', 'description'] },
                { model: Author, attributes: ['id', 'firstName', 'lastName', 'bio'], through: { attributes: [] } }
            ]
        });

        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        res.status(200).json(new ApiResponse(200, { book }, 'Book fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Create book (admin/librarian only)
const createBook = async (req, res, next) => {
    try {
        const { title, isbn, description, totalCopies, categoryId, authorIds, publishedYear, language } = req.body;

        // Proveri da li knjiga sa istim ISBN vec postoji
        const existingBook = await Book.findOne({ where: { isbn } });
        if (existingBook) {
            throw new ApiError(400, 'Book with this ISBN already exists');
        }

        // Kreiraj knjigu
        const book = await Book.create({
            title,
            isbn,
            description,
            totalCopies,
            availableCopies: totalCopies,
            categoryId,
            publishedYear,
            language
        });

        // Dodaj autore ako su poslati
        if (authorIds && authorIds.length > 0) {
            await book.setAuthors(authorIds);
        }

        // Vrati knjigu sa svim podacima
        const bookWithDetails = await Book.findByPk(book.id, {
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Author, attributes: ['id', 'firstName', 'lastName'], through: { attributes: [] } }
            ]
        });

        res.status(201).json(new ApiResponse(201, { book: bookWithDetails }, 'Book created successfully'));
    } catch (error) {
        next(error);
    }
};

// Update book
const updateBook = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);

        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        const { title, isbn, description, totalCopies, categoryId, authorIds, publishedYear, language } = req.body;

        // Update knjige
        await book.update({
            title: title || book.title,
            isbn: isbn || book.isbn,
            description: description || book.description,
            totalCopies: totalCopies || book.totalCopies,
            categoryId: categoryId || book.categoryId,
            publishedYear: publishedYear || book.publishedYear,
            language: language || book.language
        });

        // Update autora ako su poslati
        if (authorIds && authorIds.length > 0) {
            await book.setAuthors(authorIds);
        }

        // Vrati azuriranu knjigu
        const updatedBook = await Book.findByPk(book.id, {
            include: [
                { model: Category, attributes: ['id', 'name'] },
                { model: Author, attributes: ['id', 'firstName', 'lastName'], through: { attributes: [] } }
            ]
        });

        res.status(200).json(new ApiResponse(200, { book: updatedBook }, 'Book updated successfully'));
    } catch (error) {
        next(error);
    }
};

// Delete book
const deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);

        if (!book) {
            throw new ApiError(404, 'Book not found');
        }

        await book.destroy();

        res.status(200).json(new ApiResponse(200, null, 'Book deleted successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllBooks, getBook, createBook, updateBook, deleteBook };