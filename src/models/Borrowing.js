const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Borrowing = sequelize.define('Borrowing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    borrowedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    returnedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'returned', 'overdue'),
        defaultValue: 'active'
    }
}, {
    timestamps: true
});

module.exports = Borrowing;