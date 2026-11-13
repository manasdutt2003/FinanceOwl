# FinanceOwl

A full-stack personal finance tracker. Record income and expenses, see your
balance and recent activity on a dashboard, visualise trends, and export your
data to Excel.

## Features

- **Accounts**: sign up, log in and log out; sessions are kept in an
  HTTP-only cookie holding a JWT
- **Dashboard**: total income, total expenses, balance, last 30 days and the
  ten most recent transactions
- **Income and expenses**: add, list and delete entries with category, emoji
  icon, amount, date and description
- **Charts**: trends and category breakdowns
- **Excel export** of income and expense records
- **Responsive UI** built with Tailwind CSS and daisyUI

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Chart.js, Recharts, Tailwind CSS 4, daisyUI |
| Backend | Node.js, Express 5, Mongoose 8, JSON Web Tokens, bcryptjs, SheetJS |
| Database | MongoDB |

## Getting started

Requires Node.js 20+ and a MongoDB instance (local or Atlas).

### Backend

```bash
cd backend
npm install
cp .env.example .env      # set MONGO_URI and JWT_SECRET
npm run dev
```

The API runs on http://localhost:3000.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:5173.

## Configuration

Backend (`backend/.env`):

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | Signs session tokens; use a long random value |
| `PORT` | no | Defaults to 3000 |
| `CLIENT_ORIGIN` | no | Comma-separated frontend origins allowed by CORS. Defaults to `http://localhost:5173` |
| `NODE_ENV` | no | `production` marks the cookie as HTTPS-only |
| `COOKIE_SAME_SITE` | no | Set to `none` when the frontend is on a different site from the API |

Frontend (`frontend/.env`):

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | no | Full API base URL, e.g. `https://api.example.com/api/v1`. Defaults to the local backend in development and `/api/v1` on the same origin in production |

## API

All routes are under `/api/v1`. Everything except register and login requires
the session cookie.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Liveness check |
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in |
| POST | `/auth/logout` | Log out |
| GET | `/auth/getUser` | Current user |
| GET | `/dashboard` | Totals and recent transactions |
| POST | `/income/add-income` | Add income |
| GET | `/income/get-incomes` | List income |
| DELETE | `/income/delete-income/:id` | Delete income |
| GET | `/income/download-income` | Excel export |
| POST | `/expense/add-expense` | Add expense |
| GET | `/expense/get-expenses` | List expenses |
| DELETE | `/expense/delete-expense/:id` | Delete expense |
| GET | `/expense/download-expense` | Excel export |

## Project structure

```
FinanceOwl/
├── backend/
│   └── src/
│       ├── config/         database connection
│       ├── controllers/    auth, income, expense, dashboard
│       ├── middlewares/    session check
│       ├── models/         User, Income, Expense
│       ├── routes/
│       └── server.js
└── frontend/
    └── src/
        ├── components/     modals, navbar, route guard
        ├── pages/          Auth, Dashboard, GetStarted
        └── utils/api.js    Axios client
```
