# Mini Projects Platform API

This is a backend application for a platform where clients can post freelance projects and freelancers can apply to them. It provides a RESTful API to manage users, projects, and applications, with a robust role-based access control system.

-----

## ✨ Features

  * **Authentication & User Management:** Secure email/password registration and login with JWT-based authentication. Supports three user roles: **CLIENT**, **FREELANCER**, and **ADMIN**.
  * **Role-Based Access Control (RBAC):**
      * **CLIENTS** can create, read, update, and delete their own projects. They can also view applications submitted to their projects and accept them.
      * **FREELANCERS** can apply to projects and view a list of their own applications.
      * **ADMINS** have full read access to all data on the platform.
  * **Project Management:** Clients can create projects with a title, description, and budget range. Projects can have a status of `DRAFT`, `OPEN`, or `CLOSED`.
  * **Application System:** Freelancers can submit applications with a cover letter and an optional bid amount. The system prevents a freelancer from applying to the same project more than once.
  * **Flexible Data Retrieval:** Projects can be filtered by status (`OPEN`, `CLOSED`), budget range (`budgetMin`, `budgetMax`), and searched by title or description. The API supports pagination for listing projects.

-----

## 💻 Technology Stack

  * **Backend:** Node.js, Express.js
  * **Database:** PostgreSQL
  * **ORM:** Prisma
  * **Authentication:** JSON Web Tokens (JWT)

-----

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

  * Node.js (LTS version)
  * A running PostgreSQL database instance

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/utuedey/mini-projects-platform.git
    cd mini-projects-platform
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration

Create a `.env` file in the project's root directory by copying the example file:

```bash
cp .env.example .env
```

Update the following environment variables:

  * `DATABASE_URL`: Your PostgreSQL connection string.
  * `JWT_SECRET`: A strong, random string to sign JWT tokens.
  * `PORT`: The port your server will run on (e.g., `3000`).

### Database Setup

Run the Prisma commands to migrate the database and seed it with dummy data:

```bash
# Apply migrations to create the database schema
npx prisma migrate dev --name init-applications

# Seed the database with test data
npm run seed
```

### Running the Server

Start the application in development mode:

```bash
npm start
```

The API will now be running at `http://localhost:<PORT>`.

-----

## 📖 API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint                    | Description                                |
| :----- | :-------------------------- | :----------------------------------------- |
| `POST` | `/auth/register`            | Register a new user                        |
| `POST` | `/auth/login`               | Log in a user and get a JWT token          |

### Projects

| Method | Endpoint                        | Description                                                         | Access     |
| :----- | :------------------------------ | :------------------------------------------------------------------ | :--------- |
| `GET`  | `/projects`                     | Get a list of all public projects (supports filters and pagination) | `PUBLIC`   |
| `GET`  | `/projects/:id`                 | Get a single project by ID                                          | `PUBLIC`   |
| `POST` | `/projects`                     | Create a new project                                                | `CLIENT`   |
| `PATCH`| `/projects/:id`                 | Update a project (must be the owner)                                | `CLIENT`   |
| `DELETE`| `/projects/:id`                 | Delete a project (must be the owner)                                | `CLIENT`   |
| `PATCH`| `/projects/:id/open`            | Change project status from `DRAFT` to `OPEN`                        | `CLIENT`   |
| `PATCH`| `/projects/:id/close`           | Change project status from `OPEN` to `CLOSED`                       | `CLIENT`   |

### Applications

| Method | Endpoint                                | Description                                                     | Access     |
| :----- | :-------------------------------------- | :-------------------------------------------------------------- | :--------- |
| `POST` | `/projects/:id/applications`            | Apply to a project                                              | `FREELANCER` |
| `GET`  | `/projects/:id/applications`            | View all applications for a project                             | `CLIENT`, `ADMIN` |
| `GET`  | `/me/applications`                      | View all of your own applications                               | `FREELANCER` |
| `POST` | `/applications/:id/accept`              | Accept an application and close the project                     | `CLIENT`   |

-----

## 📐 Architecture

The codebase is structured to promote separation of concerns and maintainability.

  * **`controllers/`**: Handles incoming HTTP requests, validates input, and orchestrates the response.
  * **`services/`**: Contains the core business logic. All database interactions and complex operations are encapsulated here.
  * **`routes/`**: Defines the API endpoints and connects them to their respective controller functions.
  * **`middleware/`**: Houses reusable functions for tasks like authentication (`protect.middleware.js`) and role-based access control.