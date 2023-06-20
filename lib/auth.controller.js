/**
 * Express router for user authentication.
 * Contains routes for user registration and login.
 */
import express from "express";
import User from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const route = express.Router();

/**
 * Handler function for user registration.
 * Creates a new user with the provided information and saves it to the database.
 * Hashes the user's password using bcrypt.
 * Sends a success response if the user is registered successfully.
 * If an error occurs during user registration, it calls the next() function with the error.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const signup = (req, res, next) => {
  const user = new User({
    name: req.body.name,
    sex: req.body.sex,
    phone: req.body.phone,
    age: req.body.age,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user
    .save()
    .then((user, err) => {
      res.status(200).send({
        message: "User registered successfully",
      });
    })
    .catch((err) => {
      next(err);
    });
};

/**
 * Handler function for user login.
 * Finds the user with the provided email in the database.
 * Compares the provided password with the hashed password stored in the database using bcrypt.
 * If the password is valid, it generates a JWT (JSON Web Token) with the user's information.
 * Sends a success response with the user profile and access token.
 * If the user is not found or the password is invalid, it sends an appropriate error response.
 * If an error occurs during user login, it calls the next() function with the error.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const signin = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user, err) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      }
      if (!user) {
        return res.status(404).send({
          message: "User not found.",
        });
      }

      // Comparing passwords
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      // Checking if the password is valid and sending the response accordingly
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }

      // Signing a token with user id
      var token = jwt.sign(
        {
          id: user.id,
          user: user.email,
          role: user.role,
        },
        process.env.API_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Responding to the client request with the user profile success message and access token
      res.status(200).send({
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
        message: "Login successful",
        accessToken: token,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// Route for user registration
route.post("/register", signup, function (req, res, next) {});

// Route for user login
route.post("/login", signin, function (req, res, next) {});

export default route;
