# Shohay - Donation Management System

A full-stack MERN web application connecting donors with NGOs for efficient donation management.

## 🎯 Project Overview

Shohay provides a platform for three distinct user types:
- **DONOR**: Browse campaigns, make donations, track contributions
- **NGO**: Create campaigns, manage donations, engage donors
- **ADMIN**: Manage users, verify NGOs, monitor system activities

## 📦 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB
- JWT Authentication
- Mongoose ODM

### Frontend
- React.js
- Axios (API calls)
- React Router
- Context API (State Management)
- CSS Modules / Tailwind CSS

## 📁 Project Structure

```
DonationSystem/
├── server/
│   ├── config/          # Database & environment configuration
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, error handling
│   ├── utils/           # Helper functions
│   ├── app.js          # Express app setup
│   ├── server.js       # Server entry point
│   └── .env            # Environment variables
│
├── client/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service calls
│   │   ├── contexts/   # React Context
│   │   ├── hooks/      # Custom hooks
│   │   ├── styles/     # CSS modules
│   │   ├── App.js      # Main App component
│   │   └── index.js    # React entry point
│   ├── .env           # Frontend env variables
│   └── package.json
│
└── package.json        # Root dependencies

```

## 🚀 Getting Started

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### Environment Setup

Create `.env` in server directory:
```
MONGODB_URI=mongodb://localhost:27017/shohay
PORT=5000
JWT_SECRET=your_jwt_secret_key
ADMIN_SECRET_KEY=your_admin_secret_key
NODE_ENV=development
```

Create `.env` in client directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

From root directory:
```bash
npm run dev
```

Or separately:
- **Server**: `cd server && npm start`
- **Client**: `cd client && npm start`

## 📚 API Documentation

### Authentication Routes
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Donor Routes
- `GET /api/donors/profile` - Get donor profile
- `PUT /api/donors/profile` - Update donor profile
- `GET /api/donors/donations` - Get donation history

### Campaign Routes
- `GET /api/campaigns` - List all active campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create campaign (NGO only)
- `PUT /api/campaigns/:id` - Update campaign (NGO only)
- `DELETE /api/campaigns/:id` - Close campaign (NGO only)

### Donation Routes
- `POST /api/donations` - Make donation
- `GET /api/donations` - Get donations

### NGO Routes
- `GET /api/ngos/profile` - Get NGO profile
- `PUT /api/ngos/profile` - Update NGO profile

### Admin Routes
- `GET /api/admin/users` - List all users
- `POST /api/admin/ngos/verify/:id` - Verify NGO
- `GET /api/admin/dashboard` - Get analytics

## 🔐 Features

- ✅ JWT-based Authentication
- ✅ Role-based Access Control
- ✅ Secure Admin Key Verification
- ✅ Real-time Campaign Tracking
- ✅ Donation Management
- ✅ User Profile Management
- ✅ NGO Verification System

## 📝 License

MIT
