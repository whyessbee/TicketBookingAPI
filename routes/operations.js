import express from "express";
import Ticket from "../Models/Ticket.js";
import User from "../Models/User.js";
import verifyToken from "../lib/verify.controller.js";

const route = express.Router();

/**
 * POST /ticket
 * Creates a new ticket.
 * Requires a valid JWT token.
 * Body Parameters:
 *   - seat_number: The seat number for the ticket.
 * Returns the created ticket as JSON.
 */
route.post("/ticket", verifyToken, async (req, res, next) => {
  try {
    if (!req.id) {
      res.status(403).send({
        message: "Invalid JWT token",
      });
    }
    const ticket = new Ticket({ seat_number: req.body.seat_number });

    ticket.passenger = req.id;
    ticket
      .save()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    res.status(400).json(error);
  }
});

/**
 * GET /ticket/all
 * Retrieves all tickets.
 * Returns an array of tickets as JSON.
 */
route.get("/ticket/all", async (req, res, next) => {
  Ticket.find({})
    .then((data) => {
      if (data) res.status(200).json(data);
      else res.status(200).json({ result: "No data found" });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * GET /ticket/status/:ticketid
 * Retrieves the status of a specific ticket by its ID.
 * Path Parameters:
 *   - ticketid: The ID of the ticket.
 * Returns the ticket information as JSON.
 */
route.get("/ticket/status/:ticketid", async (req, res, next) => {
  Ticket.find({ _id: req.params.ticketid })
    .then((data) => {
      if (data.length) res.status(200).json(data);
      else res.status(200).json({ result: "No data found" });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * GET /ticket/open
 * Retrieves all open (unbooked) tickets.
 * Returns an array of open tickets as JSON.
 */
route.get("/ticket/open", async (req, res, next) => {
  Ticket.find({ is_booked: false })
    .then((data) => {
      if (data.length) res.status(200).json(data);
      else res.status(200).json({ result: "No data found" });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * GET /ticket/closed
 * Retrieves all closed (booked) tickets.
 * Returns an array of closed tickets as JSON.
 */
route.get("/ticket/closed", async (req, res, next) => {
  Ticket.find({ is_booked: true })
    .then((data) => {
      if (data.length) res.status(200).json(data);
      else res.status(200).json({ result: "No data found" });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * GET /ticket/user/:ticketid
 * Retrieves the user associated with a specific ticket by its ID.
 * Path Parameters:
 *   - ticketid: The ID of the ticket.
 * Returns the user information as JSON.
 */
route.get("/ticket/user/:ticketid", async (req, res) => {
  Ticket.find({ _id: req.params.ticketid })
    .then((data) => {
      if (data.length) {
        User.find({ _id: data[0].passenger })
          .then((data) => {
            if (data.length) res.status(200).json(data);
            else
              res
                .status(200)
                .json({
                  Result:
                    "No User Found For This Ticket Id: " + req.params.ticketid,
                });
          })
          .catch((err) => {
            next(err);
          });
      } else
        res
          .status(200)
          .json({ result: "No Ticket Found With Id: " + req.params.ticketid });
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * GET /user/all
 * Retrieves all users.
 * Returns an array of users as JSON.
 */
route.get("/user/all", async (req, res) => {
  User.find({}).then((data) => {
    if (data) res.status(200).json(data);
    else res.status(200).json({ result: "No data found" });
  });
});

/**
 * PATCH /ticket/reset
 * Resets all tickets to open (unbooked) status.
 * Requires a valid JWT token with admin role.
 * Returns the updated tickets as JSON.
 */
route.patch("/ticket/reset", verifyToken, async (req, res) => {
  if (!req.role) {
    res.status(403).send({
      message: "Invalid JWT token",
    });
  }
  if (req.role == "admin") {
    Ticket.find({}).then((data) => {
      if (data.length > 0) {
        data.forEach((tkt) => {
          tkt.is_booked = false;
          tkt
            .save()
            .then((data) => {
              console.log(`Ticket with id - ${tkt._id} opened.`);
            })
            .catch((err) => {
              console.log(`Ticket with id - ${tkt._id} couldn't be opened.`);
            });
        });
        res.status(200).json(data);
      } else res.send(200).json({ Result: "No data found!!!" });
    });
  } else {
    res.status(403).send({
      message: "Unauthorised access",
    });
  }
});

/**
 * PUT /ticket/update/:ticketid
 * Updates the status and passenger of a specific ticket.
 * Requires a valid JWT token.
 * Path Parameters:
 *   - ticketid: The ID of the ticket.
 * Body Parameters:
 *   - isBooked: The updated status of the ticket.
 *   - passenger: The updated passenger information.
 * Returns the updated ticket as JSON.
 */
route.put("/ticket/update/:ticketid", verifyToken, async (req, res, next) => {
  try {
    Ticket.findById(req.params.ticketid)
      .then(async (ticketData) => {
        if (ticketData) {
          ticketData.is_booked = req.body.isBooked;
          let userId = "";
          if (req.body.passenger) {
            const user = new User(req.body.passenger);
            const savedUser = await user
              .save(req.body.passenger)
              .catch((err) => {
                next(err);
              });
            userId = savedUser._id;

            if (userId) {
              ticketData.passenger = userId;
              let savedTicket = await ticketData.save().catch((err) => {
                next(err);
              });
              res.status(200).json(savedTicket);
            }
          } else {
            ticketData.save().then((data) => {
              res.status(200).json(data);
            });
          }
        } else {
          res.status(200).json({ Result: "No ticket found!!!" });
        }
      })
      .catch((err) => {
        next(err);
      });
  } catch (error) {
    console.err("Error in processing the request", error);
    res.status(500).json(error);
  }
});

export default route;
