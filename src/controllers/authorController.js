const { Author } = require('../models/index');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Get all authors
const getAllAuthors = async (req, res, next) => {
    try {
        const authors = await Author.findAll({
            order: [['lastName', 'ASC']]
        });

        res.status(200).json(new ApiResponse(200, { authors }, 'Authors fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Get single author
const getAuthor = async (req, res, next) => {
    try {
        const author = await Author.findByPk(req.params.id);

        if (!author) {
            throw new ApiError(404, 'Author not found');
        }

        res.status(200).json(new ApiResponse(200, { author }, 'Author fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Create author
const createAuthor = async (req, res, next) => {
    try {
        const { firstName, lastName, bio, country } = req.body;

        const author = await Author.create({ firstName, lastName, bio, country });

        res.status(201).json(new ApiResponse(201, { author }, 'Author created successfully'));
    } catch (error) {
        next(error);
    }
};

// Update author
const updateAuthor = async (req, res, next) => {
    try {
        const author = await Author.findByPk(req.params.id);

        if (!author) {
            throw new ApiError(404, 'Author not found');
        }

        const { firstName, lastName, bio, country } = req.body;
        
        await author.update({
            firstName: firstName || author.firstName,
            lastName: lastName || author.lastName,
            bio: bio || author.bio,
            country: country || author.country
        });

        res.status(200).json(new ApiResponse(200, { author }, 'Author updated successfully'));
    } catch (error) {
        next(error);
    }
};

// Delete author
const deleteAuthor = async (req, res, next) => {
    try {
        const author = await Author.findByPk(req.params.id);

        if (!author) {
            throw new ApiError(404, 'Author not found');
        }

        await author.destroy();

        res.status(200).json(new ApiResponse(200, null, 'Author deleted successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor };