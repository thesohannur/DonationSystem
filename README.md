# 🎯 Shohay — Donation Management System

A full-stack web application that connects **Donors** with **NGOs** and provides a platform for efficient donation management. The system features role-based access for three distinct user types with specialized functionalities.

---

## Table of Contents

- [📱 Project Scope](#-project-scope)
- [👥 User Roles & Features](#-user-roles--features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔌 API Endpoints](#-api-endpoints)
- [⚙️ Environment Variables](#️-environment-variables)
- [📄 License](#-license)

---

## 📱 Project Scope

Shohay is designed to solve the problem of fragmented donation workflows by providing a centralized platform where:

- **NGOs** can create and manage fundraising campaigns, post volunteer opportunities, and track incoming donations.
- **Donors** can discover campaigns, make monetary donations, volunteer their time, and view their contribution history.
- **Admins** can oversee the entire platform — approving or rejecting campaigns, managing users, and ensuring operational integrity.

The system supports both **monetary donations** and **time-based volunteering**, making it a comprehensive solution for charitable organizations of all sizes.

---

## 👥 User Roles & Features

### 1. 💚 Donor

> **Primary Goal:** Contribute to causes and track donations

| Feature | Description |
| --- | --- |
| ✅ Register / Login | Sign up with personal details (name, email, contact, occupation) |
| ✅ Browse Active Campaigns | View ongoing NGO fundraising events |
| ✅ Make Donations | Contribute money to specific campaigns |
| ✅ Donation Tracking | See real-time progress of campaigns |
| ✅ Donation History | View all past contributions with status (Pending / Success / Failed) |
| ✅ Profile Management | Update personal information |

### 2. 🏢 NGO (Non-Governmental Organization)

> **Primary Goal:** Create campaigns and manage donations

| Feature | Description |
| --- | --- |
| ✅ Register / Login | Sign up with organization credentials (registration number, contact person) |
| ✅ Create Campaigns | Set up fundraising events with targets |
| ✅ Campaign Management | Edit / close fundraising events |
| ✅ Donation Tracking | Monitor contributions in real-time |
| ✅ Donor Management | View donor details and thank donors |
| ✅ Verification System | NGOs require admin approval before full access |
| ✅ Organization Profile | Maintain organization details and focus areas |

### 3. 🔑 Admin

> **Primary Goal:** Oversee system and manage users

| Feature | Description |
| --- | --- |
| ✅ Secure Registration | Requires secret admin key for sign-up |
| ✅ User Management | View, activate / deactivate all users |
| ✅ NGO Verification | Approve / reject NGO registrations |
| ✅ System Monitoring | View all activities and transactions |
| ✅ Dashboard Analytics | See donation statistics and trends |
| ✅ Access Control | Full system oversight capabilities |

---

## 🛠️ Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | React 18, React Router v6, Axios     |
| Backend    | Node.js, Express.js                   |
| Database   | MongoDB (Mongoose ODM)                |
| Auth       | JSON Web Tokens (JWT), bcryptjs       |
| Dev Tools  | Nodemon, Postman (API testing)        |

---

## 🏗️ Architecture Overview

```
┌─────────────────┐        ┌──────────────────┐        ┌───────────┐
│   React Client  │◄──────►│  Express Server  │◄──────►│  MongoDB  │
│   (Port 3002)   │  REST  │   (Port 5002)    │Mongoose│  Atlas    │
└─────────────────┘        └──────────────────┘        └───────────┘
```

- **Client → Server**: All API calls go through an Axios-based service layer, proxied to `http://localhost:5002`.
- **Authentication**: JWT tokens issued on login, sent via `Authorization: Bearer <token>` headers.
- **Authorization**: Role-based middleware (`protect` + `authorize`) restricts endpoints to specific user roles.

---

## 📁 Project Structure

```
DonationSystem/
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── donor/             # Donor dashboard, campaigns, donations, profile
│   │   │   ├── HeroSection.js     # Landing page sections
│   │   │   ├── FeaturesSection.js
│   │   │   ├── RolesSection.js
│   │   │   ├── StatsSection.js
│   │   │   ├── TestimonialsSection.js
│   │   │   └── CTASection.js
│   │   ├── pages/                 # Login, Signup, Admin, Home, RoleChoice
│   │   ├── services/              # Axios API service layer
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
│
├── server/                        # Express backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/               # Business logic for each resource
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── campaignController.js
│   │   ├── donorController.js
│   │   ├── ngoController.js
│   │   ├── paymentController.js
│   │   ├── volunteerController.js
│   │   └── volunteerOpportunityController.js
│   ├── middleware/
│   │   └── auth.js                # JWT verification & role authorization
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Admin.js
│   │   ├── Donor.js
│   │   ├── NGO.js
│   │   ├── Campaign.js
│   │   ├── Payment.js
│   │   ├── Volunteer.js
│   │   └── VolunteerOpportunity.js
│   ├── routes/                    # Express route definitions
│   ├── utils/
│   ├── app.js                     # Express app setup & middleware
│   ├── server.js                  # Entry point (DB connect + listen)
│   └── package.json
│
├── postman/                       # API testing assets
│   ├── collections/
│   ├── environments/
│   ├── globals/
│   └── specs/
│
├── LICENSE                        # MIT License
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16
- **npm** ≥ 8
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/DonationSystem.git
   cd DonationSystem
   ```

2. **Set up the server**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in `server/` (see [Environment Variables](#environment-variables)).

3. **Set up the client**

   ```bash
   cd ../client
   npm install
   ```

4. **Run the application**

   ```bash
   # Terminal 1 — Start the backend
   cd server
   npm run dev

   # Terminal 2 — Start the frontend
   cd client
   npm start
   ```

   The client runs on `http://localhost:3002` and the server on `http://localhost:5002`.

---

## 🔌 API Endpoints

| Method   | Endpoint                         | Description                       | Auth Required   |
| -------- | -------------------------------- | --------------------------------- | --------------- |
| `POST`   | `/api/auth/register`             | Register a new user               | No              |
| `POST`   | `/api/auth/login`                | Login and receive JWT             | No              |
| `GET`    | `/api/donors`                    | List / search donors              | Yes             |
| `GET`    | `/api/ngos`                      | List / search NGOs                | Yes             |
| `GET`    | `/api/campaigns`                 | Browse active campaigns           | Yes             |
| `POST`   | `/api/campaigns`                 | Create a new campaign             | Yes (NGO)       |
| `POST`   | `/api/payments`                  | Make a donation payment           | Yes (Donor)     |
| `GET`    | `/api/payments`                  | View payment history              | Yes             |
| `GET`    | `/api/volunteer-opportunities`   | Browse volunteer opportunities    | Yes             |
| `POST`   | `/api/volunteers`                | Apply to volunteer                | Yes (Donor)     |
| `GET`    | `/api/admin`                     | Admin management endpoints        | Yes (Admin)     |
| `GET`    | `/api/health`                    | Server health check               | No              |

> **Full API documentation** is available via the Postman collection in the `postman/` directory.

---

## ⚙️ Environment Variables

### Server (`server/.env`)

| Variable        | Description                  | Example                                        |
| --------------- | ---------------------------- | ---------------------------------------------- |
| `PORT`          | Server port                  | `5002`                                         |
| `MONGO_URI`     | MongoDB connection string    | `mongodb+srv://user:pass@cluster.mongodb.net/shohay` |
| `JWT_SECRET`    | Secret key for signing JWTs  | `your_jwt_secret_key`                          |

### Client (`client/.env`)

| Variable              | Description          | Example                    |
| --------------------- | -------------------- | -------------------------- |
| `REACT_APP_API_URL`   | Backend API base URL | `http://localhost:5002/api`|

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

© 2026 Sohan Nur
