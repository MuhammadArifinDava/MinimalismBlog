# Full-Stack Blog Platform (MERN Monorepo)

Monorepo sederhana:
- `server/` (Node.js + Express + MongoDB/Mongoose)
- `client/` (React + Vite + Tailwind CSS)

## Fitur

- Posts: create, list, detail, edit, delete (owner-only untuk edit/delete)
- Comments: create, list, edit, delete (owner-only untuk edit/delete)
- Auth: register, login, logout (JWT Bearer token)
- Search + Pagination: `GET /posts` mendukung `q`, `page`, `limit`
- Markdown: penulisan post mendukung Markdown, render di detail page
- Profile: melihat info user + daftar post milik user
- Profile picture: upload avatar via endpoint `POST /users/me/avatar`

## Prasyarat

- Node.js (disarankan versi LTS)
- MongoDB (local atau Atlas)

## Setup Environment

Backend:
1. Copy `server/.env.example` menjadi `server/.env`
2. Isi nilai minimal:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (default 5001)

Frontend:
1. Copy `client/.env.example` menjadi `client/.env`
2. Set `VITE_API_URL` (default `http://localhost:5001`)

## Install

Jalankan dari root monorepo:

```bash
npm run setup
```

## Run (Development)

Jalankan dari root monorepo:

```bash
npm run dev
```

Default:
- Backend: `http://localhost:5001`
- Frontend (Vite): `http://localhost:5173` (bisa berubah jika port sudah terpakai)

## Seed Data (Dummy)

Untuk mengisi database dengan data contoh (users, posts, comments):

```bash
node server/seed.js
```

## API Ringkas

Auth:
- `POST /auth/register` `{ name, username, email, password }`
- `POST /auth/login` `{ email, password }`
- `POST /auth/logout`

Posts:
- `GET /posts` (Public) Query: `q`, `page`, `limit`
- `GET /posts/:id` (Public)
- `POST /posts` (Auth) `{ title, content, category? }`
- `PUT /posts/:id` (Auth + Owner) `{ title, content, category? }`
- `DELETE /posts/:id` (Auth + Owner)

Comments:
- `GET /posts/:id/comments` (Public)
- `POST /posts/:id/comments` (Auth) `{ content }`
- `PUT /comments/:id` (Auth + Owner) `{ content }`
- `DELETE /comments/:id` (Auth + Owner)

Profile:
- `GET /users/me` (Auth) mengembalikan `user` dan `posts` milik user.
- `POST /users/me/avatar` (Auth) multipart/form-data field: `avatar` (jpg/png/webp, max 2MB). File diserve di `GET /uploads/<filename>`.

## Catatan Integrasi JWT

Client mengirim token di header:

`Authorization: Bearer <token>`

## Deployment (Ringkas)

- Backend:
  - Set env vars: `MONGO_URI`, `JWT_SECRET`, `PORT`, `CLIENT_ORIGIN`
  - Start command: `npm --prefix server start`
- Frontend:
  - Set env var: `VITE_API_URL` (mengarah ke URL backend)
  - Build command: `npm --prefix client run build`
  - Deploy folder: `client/dist` (Vite)
