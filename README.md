# Library Management System - REST API

REST API za upravljanje bibliotekom implementiran po Microsoft REST API best practices.

## Opis projekta

Projekat implementira kompletan REST API za sistem upravljanja bibliotekom sa sledećim funkcionalnostima:
- Autentikacija i autorizacija (JWT)
- CRUD operacije za knjige, autore, kategorije
- Sistem pozajmica knjiga
- Sistem rezervacija
- Recenzije i ocene knjiga
- Role-based access control (Admin, Librarian, Member)

## Tehnologije

- **Node.js** v24.3.0
- **Express.js** - Web framework
- **PostgreSQL** - Relaciona baza podataka
- **Sequelize** - ORM
- **JWT** - Autentikacija
- **Swagger/OpenAPI** - API dokumentacija
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Struktura projekta
```
library-management-api/
├── src/
│   ├── config/         # Konfiguracija (baza, swagger)
│   ├── models/         # Sequelize modeli
│   ├── controllers/    # Business logika
│   ├── routes/         # API rute
│   ├── middlewares/    # Auth, error handling
│   ├── utils/          # Pomoćne funkcije
│   └── app.js          # Express app
├── server.js           # Entry point
├── .env                # Environment varijable
└── package.json
```

## Instalacija i pokretanje

### 1. Kloniraj projekat
```bash
git clone <repo-url>
cd library-management-api
```

### 2. Instaliraj dependencies
```bash
npm install
```

### 3. Konfiguriši .env fajl
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=library_super_secret_key_2024
JWT_EXPIRE=7d
DB_HOST=localhost
DB_PORT=5432
DB_NAME=library_db
DB_USER=postgres
DB_PASSWORD=postgres
```

### 4. Pokreni PostgreSQL
```bash
brew services start postgresql@16
```

### 5. Kreiraj bazu
```bash
psql postgres
CREATE DATABASE library_db;
\q
```

### 6. Pokreni server
```bash
npm run dev
```

Server će biti dostupan na: `http://localhost:3000`

## API Dokumentacija

Swagger dokumentacija je dostupna na:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Registracija korisnika
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Trenutni korisnik (protected)

### Books
- `GET /api/v1/books` - Lista knjiga (filtriranje, paginacija, sortiranje)
- `GET /api/v1/books/:id` - Detalji knjige
- `POST /api/v1/books` - Kreiranje knjige (admin/librarian)
- `PUT /api/v1/books/:id` - Ažuriranje knjige (admin/librarian)
- `DELETE /api/v1/books/:id` - Brisanje knjige (admin/librarian)

### Authors
- `GET /api/v1/authors` - Lista autora
- `GET /api/v1/authors/:id` - Detalji autora
- `POST /api/v1/authors` - Kreiranje autora (admin/librarian)
- `PUT /api/v1/authors/:id` - Ažuriranje autora (admin/librarian)
- `DELETE /api/v1/authors/:id` - Brisanje autora (admin/librarian)

### Categories
- `GET /api/v1/categories` - Lista kategorija
- `GET /api/v1/categories/:id` - Detalji kategorije
- `POST /api/v1/categories` - Kreiranje kategorije (admin/librarian)
- `PUT /api/v1/categories/:id` - Ažuriranje kategorije (admin/librarian)
- `DELETE /api/v1/categories/:id` - Brisanje kategorije (admin/librarian)

### Borrowings
- `GET /api/v1/borrowings` - Lista pozajmica (protected)
- `GET /api/v1/borrowings/:id` - Detalji pozajmice (protected)
- `POST /api/v1/borrowings` - Pozajmi knjigu (protected)
- `PATCH /api/v1/borrowings/:id/return` - Vrati knjigu (protected)

### Reservations
- `GET /api/v1/reservations` - Lista rezervacija (protected)
- `GET /api/v1/reservations/:id` - Detalji rezervacije (protected)
- `POST /api/v1/reservations` - Kreiraj rezervaciju (protected)
- `PATCH /api/v1/reservations/:id/cancel` - Otkaži rezervaciju (protected)
- `PATCH /api/v1/reservations/:id/fulfill` - Ispuni rezervaciju (admin/librarian)

### Reviews
- `GET /api/v1/books/:bookId/reviews` - Lista recenzija za knjigu
- `POST /api/v1/books/:bookId/reviews` - Kreiraj recenziju (protected)
- `PUT /api/v1/reviews/:id` - Ažuriraj recenziju (protected)
- `DELETE /api/v1/reviews/:id` - Obriši recenziju (protected)

## Autentikacija

API koristi JWT (JSON Web Token) za autentikaciju. Nakon login-a, dobijate token koji morate poslati u Authorization header-u:
```
Authorization: Bearer <token>
```

## User Roles

- **admin** - Pun pristup svim funkcijama
- **librarian** - Može upravljati knjigama, autorima, kategorijama, i ispunjavati rezervacije
- **member** - Može pregledati knjige, pozajmljivati, rezervisati i recenzirati

## Implementirane Best Practices

### 1. RESTful Design
- Pravilno korišćenje HTTP metoda (GET, POST, PUT, PATCH, DELETE)
- Smisleni URL-ovi (`/api/v1/books`, `/api/v1/books/:id`)
- Pravilni HTTP status kodovi (200, 201, 400, 401, 403, 404, 500)

### 2. Security
- JWT autentikacija
- Password hashing sa bcrypt
- Role-based authorization
- Helmet.js za security headers
- CORS konfiguracija
- Environment varijable za osetljive podatke

### 3. Error Handling
- Centralizovano error handling middleware
- Konzistentni error responses
- Validacija input podataka

### 4. API Versioning
- `/api/v1/` prefix za buduću skalabilnost

### 5. Pagination & Filtering
- Query parametri za filtriranje (`?category=1&available=true`)
- Paginacija (`?page=1&limit=10`)
- Sortiranje (`?sortBy=title&order=ASC`)

### 6. Documentation
- Swagger/OpenAPI dokumentacija
- Jasni JSDoc komentari

### 7. Code Organization
- MVC pattern (Models, Controllers, Routes)
- Separation of concerns
- Reusable middlewares i utilities

## Database Schema

### Users
- id, name, email, password, role, timestamps

### Books
- id, title, isbn, description, totalCopies, availableCopies, publishedYear, language, categoryId, timestamps

### Authors
- id, firstName, lastName, bio, country, timestamps

### Categories
- id, name, description, timestamps

### Borrowings
- id, userId, bookId, borrowedAt, dueDate, returnedAt, status, timestamps

### Reservations
- id, userId, bookId, reservedAt, status, timestamps

### Reviews
- id, userId, bookId, rating (1-5), comment, timestamps

### BookAuthors (many-to-many)
- bookId, authorId

## Primer korišćenja

### 1. Registracija
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amir",
    "email": "amir@test.com",
    "password": "password123",
    "role": "admin"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "amir@test.com",
    "password": "password123"
  }'
```

### 3. Kreiranje knjige
```bash
curl -X POST http://localhost:3000/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "The Lord of the Rings",
    "isbn": "978-0544003415",
    "description": "Epic fantasy novel",
    "totalCopies": 5,
    "categoryId": 1,
    "authorIds": [1],
    "publishedYear": 1954,
    "language": "English"
  }'
```

## Autor

Amir Pluncevic
