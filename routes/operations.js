import express from "express";
import Ticket from "../Models/Ticket.js";
import User from "../Models/User.js";

const route = express.Router();

route.post("/ticket", async (req, res) => {
  try {
    const ticket = new Ticket({ seat_number: req.body.seat_number });
    const user = new User(req.body.passenger);

    user.save().then((data) => {
      if (data) {
        ticket.passenger = data._id;
        ticket.save().then((data) => {
          res.status(200).json(data);
        });
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

route.get("/ticket/all", async (req, res) => {
  Ticket.find({}).then((data) => {
    if (data) res.status(200).json(data);
    else res.status(200).json({ result: "No data found" });
  });
});



route.get("/ticket/status/:ticketid", async (req, res) => {
  Ticket.find({ _id: req.params.ticketid }).then((data) => {
    if (data.length) res.status(200).json(data);
    else res.status(200).json({ result: "No data found" });
  });
});

route.get("/ticket/open", async (req, res) => {
  Ticket.find({ is_booked: false }).then((data) => {
    if (data.length) res.status(200).json(data);
    else res.status(200).json({ result: "No data found" });
  });
});

route.get("/ticket/closed", async (req, res) => {
  Ticket.find({ is_booked: true }).then((data) => {
    if (data.length) res.status(200).json(data);
    else res.status(200).json({ result: "No data found" });
  });
});

route.get("/ticket/user/:ticketid", async (req, res) => {
  Ticket.find({ _id: req.params.ticketid }).then((data) => {
    if (data.length) {
      User.find({ _id: data[0].passenger }).then((data) => {
        res.status(200).json(data);
      });
    } else res.status(200).json({ result: "No Ticket Found" });
  });
});

route.get("/user/all", async (req, res) => {
    User.find({}).then((data) => {
      if (data) res.status(200).json(data);
      else res.status(200).json({ result: "No data found" });
    });
  });

  route.put("/ticket/update",async(req,res)=>{
    
  })

export default route;
