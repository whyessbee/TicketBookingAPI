/**
 * Entry point for the application.
 * Sets up the Express server to handle requests.
 */

import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/operations.js";
import authRoute from "./lib/auth.controller.js";
import methodOverride from "method-override";

dotenv.config();

// Create Express application
const app = express();

try {
  // Parse request bodies as JSON
  app.use(bodyParser.json());

  // Routes
  app.use("/api", route); // Operations routes
  app.use("/auth", authRoute); // Authentication routes

  // Override HTTP methods
  app.use(methodOverride());

  // Error handling middleware
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    next(err);
    res.status(500).send(err.message);
  });

  // Connect to MongoDB database
  mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true });

  // Event listeners for MongoDB connection
  mongoose.connection.once("open", () => console.log("Connection established!"))
    .on("error", (error) => console.error("Error observed", error));

  // Start the server
  app.listen(process.env.PORT || 3003, () => {
    console.log("Listening on port " + process.env.PORT);
  });
} catch (error) {
  console.error("Error in execution", error);
  throw error;
}

export default app;
