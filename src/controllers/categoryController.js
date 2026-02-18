const { Category } = require('../models/index');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Get all categories
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });

        res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Get single category
const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        res.status(200).json(new ApiResponse(200, { category }, 'Category fetched successfully'));
    } catch (error) {
        next(error);
    }
};

// Create category
const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const category = await Category.create({ name, description });

        res.status(201).json(new ApiResponse(201, { category }, 'Category created successfully'));
    } catch (error) {
        next(error);
    }
};

// Update category
const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        const { name, description } = req.body;
        await category.update({ name: name || category.name, description: description || category.description });

        res.status(200).json(new ApiResponse(200, { category }, 'Category updated successfully'));
    } catch (error) {
        next(error);
    }
};

// Delete category
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        await category.destroy();

        res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory };