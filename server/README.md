# SchoolHub Server

Basic developer notes for running the server locally.

Setup

1. Copy ` .env.example` to `.env` and provide values.
2. Install dependencies:

```bash
cd server
npm install
```

Run

Development (auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

Notes

- The server expects a MySQL database. See `database/schema.sql` to create tables.
- Do not commit `.env` to version control.
