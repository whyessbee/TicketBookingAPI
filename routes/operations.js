import express from "express";
import Ticket from "../Models/Ticket.js";
import User from "../Models/User.js";
import verifyToken from "../lib/verify.controller.js";

const route = express.Router();

route.post("/ticket", verifyToken, async (req, res, next) => {
  try {
    if (!req.id) {
      res.status(403).send({
        message: "Invalid JWT token",
      });
    }
    const ticket = new Ticket({ seat_number: req.body.seat_number });
    //const user = new User(req.body.passenger);

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

// route.put("ticket/yash",async(req,res)=>{
//     console.log('Hi')
//     Ticket.find({}).then(data=>{
//         if(data.length>0){
//             data.forEach(tkt=>{
//                 tkt.is_booked=false;
//                 tkt.save().then(data=>{
//                     console.log(`Ticket with id - ${tkt._id} opened.`);
//                 }).catch(err=>{
//                     console.log(`Ticket with id - ${tkt._id} couldn't be opened.`);
//                 })
//             })
//             res.status(200).json(data);
//         }
//         else
//             res.send(200).json({'Result':'No data found!!!'})
//     })
// })

route.get("/user/all", async (req, res) => {
  User.find({}).then((data) => {
    if (data) res.status(200).json(data);
    else res.status(200).json({ result: "No data found" });
  });
});

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
