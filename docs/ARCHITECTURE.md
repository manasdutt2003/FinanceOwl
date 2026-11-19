# Architecture

FinanceOwl is a single-page React app talking to an Express + MongoDB JSON API.

```
Browser (React, Vite)
   |  Axios, cookies sent with credentials
   v
Express app  (backend/src/app.js)
   |  cors -> json body parser -> cookie-parser
   v
routes  ->  protect middleware  ->  controllers  ->  Mongoose models  ->  MongoDB
```

## Backend layout

| Path | Responsibility |
| --- | --- |
| `src/server.js` | Process bootstrap: load env, check `MONGO_URI` and `JWT_SECRET`, connect to MongoDB, listen, shut down cleanly on SIGINT/SIGTERM |
| `src/app.js` | `createApp()` builds the Express app (middleware, routes, 404 and error handlers). It has no side effects, so tests can use it without a database |
| `src/config/db.js` | Mongoose connection; exits the process if the connection fails |
| `src/routes/*` | URL to controller mapping under `/api/v1` |
| `src/middlewares/authMiddleware.js` | `protect`: verifies the session cookie and attaches `req.user` |
| `src/controllers/*` | Request validation and business logic for auth, income, expenses and dashboard |
| `src/models/*` | Mongoose schemas: User, Income, Expense |

## Authentication

Login and registration issue a JWT (30 day expiry) signed with `JWT_SECRET` and store it in an HTTP-only cookie. The cookie is `Secure` when `NODE_ENV=production`. `SameSite` defaults to `lax` and can be set with `COOKIE_SAME_SITE` for cross-site deployments. Passwords are hashed with bcryptjs in the User model. Login returns the same message for an unknown email and a wrong password, and rejects non-string credentials so objects cannot be passed to MongoDB as query operators.

## Data scoping

Every income and expense query includes the authenticated `userId`. Deleting another user's record returns 404.

## Error handling

Controllers validate input and return `{ success: false, message }` with a 4xx status. Unexpected failures return a generic 500 message. Malformed JSON bodies and uncaught errors go through the final error middleware in `app.js`, which hides details for 5xx responses.

## Dashboard

`GET /dashboard` runs MongoDB aggregations for lifetime totals and the last 30 days, then merges the ten most recent incomes and ten most recent expenses (by creation time) into one list of ten transactions.

## Testing

`npm test` in `backend/` runs the Node built-in test runner against `createApp()` over a real local port. The current tests cover the HTTP layer and input validation paths that return before any database access. Controller logic that needs MongoDB is not yet covered.

## Deployment

`backend/Dockerfile` builds a production image of the API. The frontend is a static Vite build; set `VITE_API_URL` if it is not served from the same origin as the API.

## Known limitations

- No rate limiting on login or registration.
- Income and expense controllers do not share validation code.
- No integration tests with a database.
