# 🎯 Shohay — Donation Management System

A full-stack web application that connects **Donors** with **NGOs** and provides a platform for efficient donation management. The system features role-based access for three distinct user types with specialized functionalities.

---

## Table of Contents

- [Project Screenshots](#project-screenshots) ·
  [Project Scope](#project-scope) ·
  [User Roles & Features](#user-roles--features) ·
  [Tech Stack](#tech-stack) ·
  [Architecture Overview](#architecture-overview) ·
  [Project Structure](#project-structure) ·
  [Getting Started](#getting-started) ·
  [API Endpoints](#api-endpoints) ·
  [Environment Variables](#environment-variables) ·
  [License](#license)

---

## Project Screenshots

The following screenshots demonstrate the major features and user interfaces of the application.

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/a5f0dcf6-b4c5-4bd4-8a7d-292bc9709f49" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/de7f8f57-4ce1-4523-8241-ec4bf2110ea5" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/aaf3b946-f15d-45b7-bcb6-6fd94d41326c" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/096d8bb4-bc1b-414c-9f4d-f89dcd111872" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/0a9d2e53-24ab-4d8d-aa4c-ce49616facd4" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/7e2d24af-e7e0-400d-9688-f00c604e9220" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/9d1bf525-c27c-43a5-a510-ca8c80cd0209" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/117f0086-3c61-4049-892c-98da2077a64a" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/67685988-dea7-4c8f-a1e6-2dd4ef356e36" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/2971d7fd-7922-4ffd-afde-6d96feda4a9f" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/35a5e851-66ca-4e8a-b6a3-44b711c362cb" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/341ec802-d721-482a-ae08-597d84de8c6a" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/490ffeac-39d1-466c-ae82-40da97d88c50" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/4ce2e9f2-a66b-4870-835b-ed641acd85cb" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/8423229d-ad4a-4dfa-b04f-e7fb2e1d8088" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/3fbfd8d0-f1b8-4f82-9bae-bc3efd788bd7" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/3333f154-7c4c-48db-99c8-00073eb4aac6" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/9df79f94-047f-4c13-afdf-6f0868932bef" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/ff86b3ca-177f-4fd6-870e-4736eff3bc8a" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/1ffb7802-99ec-4daf-a75f-9bdf922e4b03" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/3aee4c97-9779-4259-b0cb-fc759e20f0d9" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/349dee47-05b4-46e4-9c25-603c12ef782f" width="400"></td>
  </tr>

  <tr>
    <td><img src="https://github.com/user-attachments/assets/5012c8f0-0c9c-4be4-a89c-43574834c669" width="400"></td>
    <td><img src="https://github.com/user-attachments/assets/3fb93e1f-7dfa-4920-9f54-0c30638e41e4" width="400"></td>
  </tr>

</table>

---

## Project Scope

Shohay is designed to solve the problem of fragmented donation workflows by providing a centralized platform where:

- **NGOs** can create and manage fundraising campaigns, post volunteer opportunities, and track incoming donations.
- **Donors** can discover campaigns, make monetary donations, volunteer their time, and view their contribution history.
- **Admins** can oversee the entire platform — approving or rejecting campaigns, managing users, and ensuring operational integrity.

The system supports both **monetary donations** and **time-based volunteering**, making it a comprehensive solution for charitable organizations of all sizes.

---

## User Roles & Features

### 1. Donor

> **Primary Goal:** Contribute to causes and track donations

| Feature | Description |
| --- | --- |
| ✅ Register / Login | Sign up with personal details (name, email, contact, occupation) |
| ✅ Browse Active Campaigns | View ongoing NGO fundraising events |
| ✅ Make Donations | Contribute money to specific campaigns |
| ✅ Donation Tracking | See real-time progress of campaigns |
| ✅ Donation History | View all past contributions with status (Pending / Success / Failed) |
| ✅ Profile Management | Update personal information |

### 2. NGO (Non-Governmental Organization)

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

### 3. Admin

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

## Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | React 18, React Router v6, Axios     |
| Backend    | Node.js, Express.js                   |
| Database   | MongoDB (Mongoose ODM)                |
| Auth       | JSON Web Tokens (JWT), bcryptjs       |
| Dev Tools  | Nodemon, Postman (API testing)        |

---

## Architecture Overview

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

## Project Structure

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

## Getting Started

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

## API Endpoints

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

## Environment Variables

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


## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

© 2026 Sohan Nur
