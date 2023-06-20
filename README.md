

# Ticket Booking System

This is a Ticket Booking System built with Node.js and Express. It allows users to register, login, and perform various operations related to ticket booking.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Code Overview](#code-overview)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Database](#database)
- [Dependencies](#dependencies)
- [License](#license)

## Getting Started

### Prerequisites

To run this application, you need to have the following installed:

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone [<repository-url>](https://github.com/whyessbee/TicketBookingAPI.git)
   ```

2. Install the dependencies:

   ```bash
   cd ticket-booking-system
   npm install
   ```

3. Configure the environment variables:

   - Create a `.env` file based on the provided `.env.example` file.
   - Update the values in the `.env` file according to your setup.

4. Start the application:

   ```bash
   npm start
   ```

   The application should now be running on `http://localhost:3003`.

## Code Overview

The codebase is organized into different directories, each serving a specific purpose:

- `models`: Contains the database models for User and Ticket.
- `lib`: Contains utility functions, such as token verification.
- `routes`: Contains the route handlers for various API endpoints.
- `middlewares`: Contains middleware functions used in the application.
- `controllers`: Contains controller functions that handle the business logic.
- `index.js`: The entry point of the application.

## API Endpoints

- `/api/register` - Register a new user.
- `/api/login` - User login.
- `/api/ticket` - Create a new ticket.
- `/api/ticket/all` - Get all tickets.
- `/api/ticket/status/:ticketid` - Get the status of a specific ticket.
- `/api/ticket/open` - Get all open tickets.
- `/api/ticket/closed` - Get all closed tickets.
- `/api/ticket/user/:ticketid` - Get the user details associated with a ticket.
- `/api/ticket/reset` - Reset all tickets (Admin only).
- `/api/ticket/update/:ticketid` - Update the status and passenger of a ticket.

For detailed documentation of each endpoint and their request/response formats, refer to the source code comments and API documentation.

## Error Handling

Errors are handled using Express middleware. When an error occurs, the middleware sends an appropriate error response with a corresponding status code and error message.

## Authentication

Authentication is implemented using JSON Web Tokens (JWT). Users can register and login to obtain an access token, which they need to include in the Authorization header of authenticated requests.

## Database

The application uses MongoDB as the database. It stores user information and ticket details in separate collections.

## Dependencies

The main dependencies used in this project are:

- Express.js: Web application framework
- Mongoose: MongoDB object modeling
- bcrypt: Password hashing and comparison
- jsonwebtoken: JWT generation and verification

For a complete list of dependencies, refer to the `package.json` file.

## License

This project is licensed under the [MIT License](LICENSE).


Feel free to modify and enhance the README file according to your specific requirements and additional information you want to provide about the project.
