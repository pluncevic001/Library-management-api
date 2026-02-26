# Library Management System - REST API

REST API za upravljanje bibliotekom implementiran u Node.js sa Express frameworkom.

## Opis projekta

Sistem za upravljanje bibliotekom koji omogućava:
- Autentikacija i autorizacija korisnika (JWT)
- CRUD operacije za knjige, autore i kategorije
- Pozajmica i vraćanje knjiga
- Rezervacije knjiga
- Recenzije i ocjene knjiga
- Tri nivoa pristupa: Admin, Librarian, Member

## Tehnologije

- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- JWT autentikacija
- Swagger/OpenAPI dokumentacija
- bcryptjs, Helmet, CORS

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

## Instalacija

```bash
git clone <repo-url>
cd library-management-api
npm install
```

Konfiguriši `.env` fajl:
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

Kreiraj bazu i pokreni:
```bash
psql postgres -c "CREATE DATABASE library_db;"
npm run dev
```

Server na: `http://localhost:3000`
Swagger dokumentacija: `http://localhost:3000/api-docs`

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Registracija
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Trenutni korisnik

### Books
- `GET /api/v1/books` - Lista knjiga (filtriranje, paginacija)
- `GET /api/v1/books/:id` - Detalji knjige
- `POST /api/v1/books` - Kreiranje (admin/librarian)
- `PUT /api/v1/books/:id` - Ažuriranje (admin/librarian)
- `DELETE /api/v1/books/:id` - Brisanje (admin/librarian)

### Authors
- `GET /api/v1/authors` - Lista autora
- `GET /api/v1/authors/:id` - Detalji autora
- `POST /api/v1/authors` - Kreiranje (admin/librarian)
- `PUT /api/v1/authors/:id` - Ažuriranje (admin/librarian)
- `DELETE /api/v1/authors/:id` - Brisanje (admin/librarian)

### Categories
- `GET /api/v1/categories` - Lista kategorija
- `GET /api/v1/categories/:id` - Detalji kategorije
- `POST /api/v1/categories` - Kreiranje (admin/librarian)
- `PUT /api/v1/categories/:id` - Ažuriranje (admin/librarian)
- `DELETE /api/v1/categories/:id` - Brisanje (admin/librarian)

### Borrowings
- `GET /api/v1/borrowings` - Lista pozajmica
- `POST /api/v1/borrowings` - Pozajmi knjigu
- `PATCH /api/v1/borrowings/:id/return` - Vrati knjigu

### Reservations
- `GET /api/v1/reservations` - Lista rezervacija
- `POST /api/v1/reservations` - Kreiraj rezervaciju
- `PATCH /api/v1/reservations/:id/cancel` - Otkaži
- `PATCH /api/v1/reservations/:id/fulfill` - Ispuni (admin/librarian)

### Reviews
- `GET /api/v1/books/:bookId/reviews` - Recenzije za knjigu
- `POST /api/v1/books/:bookId/reviews` - Kreiraj recenziju
- `PUT /api/v1/reviews/:id` - Ažuriraj recenziju
- `DELETE /api/v1/reviews/:id` - Obriši recenziju

## Autentikacija

Koristi se JWT token koji se šalje u headeru:
```
Authorization: Bearer <token>
```

## Korisničke role

- **admin** - Pun pristup
- **librarian** - Upravljanje knjigama, autorima, kategorijama
- **member** - Pregled, pozajmica, rezervacija, recenzija

## Autor

Amir Pluncevic
