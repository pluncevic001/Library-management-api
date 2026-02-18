const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { connectDB } = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

// Import models
require('./models/index');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger'); 
const app = express();

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuta
    max: 100 // max 100 zahteva po IP
});

app.use('/api/', limiter);


// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Library Management API',
        version: '1.0.0',
        docs: '/api-docs'
    });
});
// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Routes
// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/books', require('./routes/books'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/authors', require('./routes/authors'));
app.use('/api/v1/borrowings', require('./routes/borrowings'));
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/reservations', require('./routes/reservations'));
// Error handler (mora biti na kraju)
app.use(errorHandler);

module.exports = app;