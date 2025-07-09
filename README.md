# ExpenseTracker

A full-stack application to track your income and expenses, visualize your financial data, and manage your financial health.

## Features

- **User Authentication**: Secure signup and login.
- **Dashboard**: Overview of total income, expenses, balance, and recent transactions.
- **Income Management**: Add, view, and delete income records with category and date.
- **Expense Management**: Add, view, and delete expense records with category and date.
- **Data Visualization**: Line graphs and pie charts for income and expense trends/distribution.
- **Responsive Design**: Optimized for various screen sizes.
- **Modern UI**: Built with React, Tailwind CSS, and DaisyUI components.

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **React Router DOM**: For declarative routing in React applications.
- **Axios**: For making HTTP requests to the backend API.
- **React Hot Toast**: For beautiful and responsive notifications.
- **Chart.js & React-Chartjs-2**: For creating interactive data visualizations.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **DaisyUI**: A Tailwind CSS component library for ready-made UI components.

### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL document database.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **bcryptjs**: For password hashing.
- **jsonwebtoken**: For creating and verifying JWTs for authentication.
- **Cookie-parser**: Middleware to parse cookies.
- **CORS**: Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- **Dotenv**: To load environment variables from a `.env` file.
- **Nodemon**: A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud-based service like MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <repository_url>
cd expenseTracker
```

### 2. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following content:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```
Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., `mongodb://localhost:27017/expense_tracker` or your MongoDB Atlas connection string).
Replace `your_jwt_secret_key` with a strong, random string.

Start the backend server:
```bash
npm run dev
```
The backend server will run on `http://localhost:3000`.

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The frontend application will run on `http://localhost:5173`.

### 4. Usage
Open your browser and go to `http://localhost:5173`.
- Sign up for a new account or log in with existing credentials.
- Navigate to the Dashboard, Income, and Expense pages to manage your finances.

## Project Structure

```
expenseTracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── uploads/
│   │   └── utils/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   └── GetStarted.jsx
│   │   └── utils/
│   ├── index.html
│   └── package.json
└── README.md
└── .gitignore
```

## Contributing
Feel free to fork the repository and contribute. 