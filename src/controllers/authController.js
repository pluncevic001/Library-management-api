const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Generisanje JWT tokena
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Register
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Provera da li user vec postoji
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new ApiError(400, 'Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kreiraj usera
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'member'
        });

        // Generisi token
        const token = generateToken(user.id);

        res.status(201).json(new ApiResponse(201, {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, 'User registered successfully'));
    } catch (error) {
        next(error);
    }
};

// Login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Proveri da li su email i password poslati
        if (!email || !password) {
            throw new ApiError(400, 'Please provide email and password');
        }

        // Nadji usera
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Proveri password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid credentials');
        }

        // Generisi token
        const token = generateToken(user.id);

        res.status(200).json(new ApiResponse(200, {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, 'Login successful'));
    } catch (error) {
        next(error);
    }
};

// Get current user
const getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json(new ApiResponse(200, { user }, 'User fetched successfully'));
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };