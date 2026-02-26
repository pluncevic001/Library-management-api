const { User, Book, Author, Category, Borrowing, Review, Reservation } = require('../models/index');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await Review.destroy({ where: {} });
        await Reservation.destroy({ where: {} });
        await Borrowing.destroy({ where: {} });
        await Book.destroy({ where: {} });
        await Author.destroy({ where: {} });
        await Category.destroy({ where: {} });
        await User.destroy({ where: {} });

        console.log('✅ Cleared existing data');

        // 1. Create Users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = await User.bulkCreate([
            { name: 'Admin User', email: 'admin@library.com', password: hashedPassword, role: 'admin' },
            { name: 'John Librarian', email: 'librarian@library.com', password: hashedPassword, role: 'librarian' },
            { name: 'Alice Member', email: 'alice@test.com', password: hashedPassword, role: 'member' },
            { name: 'Bob Member', email: 'bob@test.com', password: hashedPassword, role: 'member' },
            { name: 'Charlie Member', email: 'charlie@test.com', password: hashedPassword, role: 'member' }
        ]);

        console.log('✅ Created 5 users');

        // 2. Create Categories
        const categories = await Category.bulkCreate([
            { name: 'Fiction', description: 'Fictional literature and novels' },
            { name: 'Science Fiction', description: 'Science fiction and fantasy novels' },
            { name: 'Mystery', description: 'Mystery and thriller books' },
            { name: 'Biography', description: 'Biographies and memoirs' },
            { name: 'Science', description: 'Scientific and educational books' },
            { name: 'History', description: 'Historical books and documentaries' }
        ]);

        console.log('✅ Created 6 categories');

        // 3. Create Authors
        const authors = await Author.bulkCreate([
            { firstName: 'J.R.R.', lastName: 'Tolkien', bio: 'English writer and philologist, best known for The Hobbit and The Lord of the Rings', country: 'United Kingdom' },
            { firstName: 'George', lastName: 'Orwell', bio: 'English novelist and essayist, known for 1984 and Animal Farm', country: 'United Kingdom' },
            { firstName: 'Agatha', lastName: 'Christie', bio: 'English writer known for detective novels', country: 'United Kingdom' },
            { firstName: 'Isaac', lastName: 'Asimov', bio: 'American writer and professor, prolific author of science fiction', country: 'United States' },
            { firstName: 'Stephen', lastName: 'Hawking', bio: 'English theoretical physicist and cosmologist', country: 'United Kingdom' },
            { firstName: 'Yuval Noah', lastName: 'Harari', bio: 'Israeli historian and author', country: 'Israel' },
            { firstName: 'Malcolm', lastName: 'Gladwell', bio: 'Canadian journalist and author', country: 'Canada' },
            { firstName: 'Frank', lastName: 'Herbert', bio: 'American science fiction author, best known for Dune', country: 'United States' }
        ]);

        console.log('✅ Created 8 authors');

        // 4. Create Books
        const books = await Book.bulkCreate([
            {
                title: 'The Lord of the Rings',
                isbn: '978-0544003415',
                description: 'Epic high-fantasy novel following the quest to destroy the One Ring',
                totalCopies: 5,
                availableCopies: 3,
                publishedYear: 1954,
                language: 'English',
                categoryId: categories[1].id
            },
            {
                title: 'The Hobbit',
                isbn: '978-0547928227',
                description: 'Fantasy novel about Bilbo Baggins adventure',
                totalCopies: 4,
                availableCopies: 4,
                publishedYear: 1937,
                language: 'English',
                categoryId: categories[1].id
            },
            {
                title: '1984',
                isbn: '978-0451524935',
                description: 'Dystopian social science fiction novel',
                totalCopies: 6,
                availableCopies: 5,
                publishedYear: 1949,
                language: 'English',
                categoryId: categories[0].id
            },
            {
                title: 'Animal Farm',
                isbn: '978-0452284244',
                description: 'Allegorical novella about revolution and power',
                totalCopies: 5,
                availableCopies: 5,
                publishedYear: 1945,
                language: 'English',
                categoryId: categories[0].id
            },
            {
                title: 'Murder on the Orient Express',
                isbn: '978-0062693662',
                description: 'Detective novel featuring Hercule Poirot',
                totalCopies: 3,
                availableCopies: 2,
                publishedYear: 1934,
                language: 'English',
                categoryId: categories[2].id
            },
            {
                title: 'Foundation',
                isbn: '978-0553293357',
                description: 'Science fiction novel about the fall and rise of civilization',
                totalCopies: 4,
                availableCopies: 4,
                publishedYear: 1951,
                language: 'English',
                categoryId: categories[1].id
            },
            {
                title: 'A Brief History of Time',
                isbn: '978-0553380163',
                description: 'Popular science book on cosmology',
                totalCopies: 5,
                availableCopies: 3,
                publishedYear: 1988,
                language: 'English',
                categoryId: categories[4].id
            },
            {
                title: 'Sapiens',
                isbn: '978-0062316097',
                description: 'A brief history of humankind',
                totalCopies: 6,
                availableCopies: 4,
                publishedYear: 2011,
                language: 'English',
                categoryId: categories[5].id
            },
            {
                title: 'Outliers',
                isbn: '978-0316017930',
                description: 'The story of success',
                totalCopies: 4,
                availableCopies: 4,
                publishedYear: 2008,
                language: 'English',
                categoryId: categories[3].id
            },
            {
                title: 'Dune',
                isbn: '978-0441172719',
                description: 'Science fiction novel set in the distant future',
                totalCopies: 5,
                availableCopies: 3,
                publishedYear: 1965,
                language: 'English',
                categoryId: categories[1].id
            }
        ]);

        console.log('✅ Created 10 books');

        // 5. Associate Books with Authors (many-to-many)
        await books[0].setAuthors([authors[0].id]); // LOTR - Tolkien
        await books[1].setAuthors([authors[0].id]); // Hobbit - Tolkien
        await books[2].setAuthors([authors[1].id]); // 1984 - Orwell
        await books[3].setAuthors([authors[1].id]); // Animal Farm - Orwell
        await books[4].setAuthors([authors[2].id]); // Murder - Christie
        await books[5].setAuthors([authors[3].id]); // Foundation - Asimov
        await books[6].setAuthors([authors[4].id]); // Brief History - Hawking
        await books[7].setAuthors([authors[5].id]); // Sapiens - Harari
        await books[8].setAuthors([authors[6].id]); // Outliers - Gladwell
        await books[9].setAuthors([authors[7].id]); // Dune - Herbert

        console.log('✅ Associated books with authors');

        // 6. Create Borrowings
        const dueDate1 = new Date();
        dueDate1.setDate(dueDate1.getDate() + 14);

        const dueDate2 = new Date();
        dueDate2.setDate(dueDate2.getDate() + 7);

        await Borrowing.bulkCreate([
            {
                userId: users[2].id, // Alice
                bookId: books[0].id, // LOTR
                borrowedAt: new Date(),
                dueDate: dueDate1,
                status: 'active'
            },
            {
                userId: users[3].id, // Bob
                bookId: books[2].id, // 1984
                borrowedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                dueDate: dueDate2,
                status: 'active'
            },
            {
                userId: users[4].id, // Charlie
                bookId: books[4].id, // Murder
                borrowedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                returnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                status: 'returned'
            }
        ]);

        console.log('✅ Created 3 borrowings');

        // 7. Create Reviews
        await Review.bulkCreate([
            {
                userId: users[2].id,
                bookId: books[1].id, // Hobbit
                rating: 5,
                comment: 'Amazing adventure story! A timeless classic that captivated me from start to finish.'
            },
            {
                userId: users[3].id,
                bookId: books[2].id, // 1984
                rating: 5,
                comment: 'Terrifyingly relevant even today. A must-read for everyone.'
            },
            {
                userId: users[4].id,
                bookId: books[4].id, // Murder
                rating: 4,
                comment: 'Brilliant mystery with an unexpected twist. Agatha Christie at her best!'
            },
            {
                userId: users[2].id,
                bookId: books[7].id, // Sapiens
                rating: 5,
                comment: 'Mind-blowing perspective on human history. Changed how I see the world.'
            },
            {
                userId: users[3].id,
                bookId: books[6].id, // Brief History
                rating: 4,
                comment: 'Complex topics explained in an accessible way. Fascinating read.'
            }
        ]);

        console.log('✅ Created 5 reviews');

        // 8. Create Reservations
        await Reservation.bulkCreate([
            {
                userId: users[2].id,
                bookId: books[9].id, // Dune
                reservedAt: new Date(),
                status: 'pending'
            },
            {
                userId: users[3].id,
                bookId: books[7].id, // Sapiens
                reservedAt: new Date(),
                status: 'pending'
            }
        ]);

        console.log('✅ Created 2 reservations');

        console.log('\n🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log('   - 5 Users (1 admin, 1 librarian, 3 members)');
        console.log('   - 6 Categories');
        console.log('   - 8 Authors');
        console.log('   - 10 Books');
        console.log('   - 3 Borrowings (2 active, 1 returned)');
        console.log('   - 5 Reviews');
        console.log('   - 2 Reservations\n');
        console.log('🔐 Test credentials:');
        console.log('   Admin: admin@library.com / password123');
        console.log('   Librarian: librarian@library.com / password123');
        console.log('   Member: alice@test.com / password123\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
};

module.exports = seedDatabase;  