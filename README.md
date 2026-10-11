
# Expense Voucher Management System

A full-stack web application designed to simplify employee expense submissions, voucher tracking, and approval workflows. The system provides role-based access for Employees, Directors, and the Accounts team.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Workflow](#application-workflow)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Demo Credentials](#demo-credentials)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Troubleshooting](#troubleshooting)

## Overview

The Expense Voucher Management System digitizes the process of creating, submitting, reviewing, and tracking employee expense claims.

Employees can create expense vouchers and submit them for approval. Directors can review vouchers and approve or reject them, while the Accounts team can monitor expense records.

The application uses React and Vite for the frontend, Node.js and Express for the backend, and MongoDB for data persistence.

## Features

### Employee Management
- Create and manage expense vouchers.
- Save vouchers as drafts.
- Submit vouchers for approval.
- Track voucher status and rejection feedback.

### Approval Workflow
- Review submitted expense vouchers.
- Approve or reject vouchers.
- Record rejection reasons.
- Track voucher status throughout the approval process.

### Role-Based Access
- Employee, Director, and Accounts roles.
- Role-based access to application features.
- Protected backend API endpoints.

### Authentication and Security
- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected API routes.
- Environment-based configuration.

### Dashboard and Expense Tracking
- View expense and voucher information.
- Track draft, pending, approved, and rejected vouchers where supported.
- Review expense records according to user permissions.

## Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development server and build tool |
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Nodemon | Backend development |
| npm | Package management |

## Project Structure

```text
expense-voucher-management/
├── backend/
│   ├── database/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Voucher.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

Additional routes, components, middleware, and configuration files may exist in the project.

## Application Workflow

1. **Login:** Users sign in using their email and password.
2. **Create Voucher:** Employees enter expense details.
3. **Save Draft:** Employees can save incomplete vouchers for later editing.
4. **Submit Voucher:** Completed vouchers are submitted for approval.
5. **Review:** The Director reviews submitted vouchers.
6. **Decision:** The Director approves or rejects the voucher.
7. **Track Status:** Users can view the updated voucher status according to their permissions.
8. **Accounts Review:** The Accounts team monitors expense records.

## User Roles

| Feature | Employee | Director | Accounts |
|---|---|---|---|
| Login | Yes | Yes | Yes |
| Create vouchers | Yes | No | No |
| Manage own drafts | Yes | No | No |
| Submit vouchers | Yes | No | No |
| Review vouchers | No | Yes | View access |
| Approve or reject | No | Yes | No |
| View expense records | Own records | Authorized records | Authorized records |

*Actual permissions depend on the authorization rules implemented in the backend.*

## Prerequisites

Install the following software:

- Node.js
- npm
- MongoDB Community Server or MongoDB Atlas
- Git (optional)
- Visual Studio Code (recommended)

Verify the installation:

```bash
node -v
npm -v
```

## Installation

### 1. Clone the Repository

Replace the placeholder with your GitHub repository URL.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd expense-voucher-management
```

If you already have the project locally, open the project root directory in your terminal.

### 2. Install Dependencies

Run the following command from the project root:

```bash
npm run install:all
```

Alternatively, install dependencies individually:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

### 3. Configure Environment Variables

Create the backend environment file.

**Windows PowerShell:**

```powershell
Copy-Item .\backend\.env.example .\backend\.env
```

Open `backend/.env` and configure the values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27018/expense_voucher_db
JWT_SECRET=replace_with_a_secure_random_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Update `MONGODB_URI` if your MongoDB instance uses a different port or a cloud database.

**Important:** Never commit your actual `.env` file or production secrets to GitHub.

### 4. Start MongoDB

Ensure that MongoDB is running and accessible at the connection string configured in `MONGODB_URI`.

For a separate local MongoDB instance using port `27018`, create the database directory if necessary:

```powershell
New-Item -ItemType Directory -Force -Path "C:\data\expense-voucher-db"
```

Then start MongoDB, assuming `mongod` is available in your PATH:

```powershell
mongod --dbpath "C:\data\expense-voucher-db" --port 27018 --bind_ip 127.0.0.1
```

Keep the MongoDB terminal running.

### 5. Seed Demo Data

From the project root, run:

```bash
npm run seed
```

This creates demonstration users and sample vouchers.

**Warning:** The current seed script deletes existing user and voucher records in the configured database before inserting demo data. Use this command only with a development database whose contents can safely be replaced.

## Running the Application

Start the backend and frontend together from the project root:

```bash
npm run dev
```

Expected URLs:

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

If port `5173` is already occupied, Vite may automatically start on another port, such as `5174`. Open the URL printed in your terminal.

Keep both MongoDB and the application processes running.

## Demo Credentials

The seed script creates the following accounts.

**Password for all demo accounts:** `Demo@123`

| Role | Email |
|---|---|
| Employee | `employee@expenseflow.demo` |
| Employee | `ananya@expenseflow.demo` |
| Director | `director@expenseflow.demo` |
| Accounts | `accounts@expenseflow.demo` |

These credentials are for local development and demonstration only. Replace demo credentials and implement appropriate security controls before production deployment.

## API Endpoints

The backend uses REST-style API routes. The following login endpoint is used by the application:

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the authenticated user's information |

### Voucher Management

Typical voucher operations may include the following routes. Confirm the exact paths and methods in your backend route files before using them.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/vouchers` | Retrieve accessible vouchers |
| GET | `/api/vouchers/:id` | Retrieve voucher details |
| POST | `/api/vouchers` | Create a voucher |
| PUT | `/api/vouchers/:id` | Update a voucher |
| DELETE | `/api/vouchers/:id` | Delete a voucher when permitted |
| POST | `/api/vouchers/:id/submit` | Submit a voucher |
| POST | `/api/vouchers/:id/approve` | Approve a voucher |
| POST | `/api/vouchers/:id/reject` | Reject a voucher |

Protected endpoints require valid authentication and appropriate authorization.

## Database Models

### User

Stores user details such as:

- Name
- Email
- Hashed password
- Role
- Department
- Employee ID

### Voucher

Stores expense voucher information, including voucher identifiers, expense details, dates, amounts, and approval status, as defined by the application's Mongoose schema.

## Troubleshooting

### Unable to Sign In — Check the API Connection

Make sure MongoDB and the backend server are running.

Check whether port `5000` is listening:

```powershell
netstat -ano | findstr :5000
```

If no process is listening, start the backend and inspect its terminal output.

### MongoDB Connection Refused

An error such as:

```text
ECONNREFUSED 127.0.0.1:27018
```

means the configured database server is not accepting connections. Start the correct MongoDB instance or update `MONGODB_URI`.

### Port Already in Use

If a port is already occupied, identify the process before stopping it. Alternatively, stop the old application instance or configure a different port.

### Demo Login Fails

Verify that the demo accounts exist in the database configured by `MONGODB_URI`. Run the seed script only if it is safe to replace the existing development records.

### Frontend Cannot Connect to Backend

Check the proxy configuration in `frontend/vite.config.js` and verify that requests to `/api` are forwarded to the backend at `http://localhost:5000`.

Restart the frontend after modifying its configuration.

## Future Enhancements

Potential improvements include:

- Expense reports and analytics.
- Email notifications for approval updates.
- Advanced search and filtering.
- Audit history for voucher actions.
- Automated testing.
- Production deployment and monitoring.

## License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute the project under a particular open-source license.
