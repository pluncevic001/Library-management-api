const User = require('./User');
const Book = require('./Book');
const Author = require('./Author');
const Category = require('./Category');
const Borrowing = require('./Borrowing');
const Review = require('./Review');
const Reservation = require('./Reservation');

// Book pripada jednoj kategoriji, kategorija ima vise knjiga
Category.hasMany(Book, { foreignKey: 'categoryId' });
Book.belongsTo(Category, { foreignKey: 'categoryId' });

// Book i Author - many to many (knjiga moze imati vise autora i obrnuto)
Book.belongsToMany(Author, { through: 'BookAuthors', foreignKey: 'bookId' });
Author.belongsToMany(Book, { through: 'BookAuthors', foreignKey: 'authorId' });

// User moze imati vise pozajmica, pozajmica pripada jednom useru i jednoj knjizi
User.hasMany(Borrowing, { foreignKey: 'userId' });
Borrowing.belongsTo(User, { foreignKey: 'userId' });
Book.hasMany(Borrowing, { foreignKey: 'bookId' });
Borrowing.belongsTo(Book, { foreignKey: 'bookId' });

// User moze imati vise recenzija, recenzija pripada jednom useru i jednoj knjizi
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Book.hasMany(Review, { foreignKey: 'bookId' });
Review.belongsTo(Book, { foreignKey: 'bookId' });

// User moze imati vise rezervacija, rezervacija pripada jednom useru i jednoj knjizi
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });
Book.hasMany(Reservation, { foreignKey: 'bookId' });
Reservation.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = { User, Book, Author, Category, Borrowing, Review, Reservation };