import express from "express";
import User from "../Models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const route = express.Router();

const signup = (req, res) => {
    const user = new User({
      name: req.body.name,
      sex:req.body.sex,
      phone:req.body.phone,
      age:req.body.age,
      email: req.body.email,
      role: req.body.role,
      password: bcrypt.hashSync(req.body.password, 8)
    });
  
    user.save().then((user,err) => {
      if (err) {
        res.status(500)
          .send({
            message: err
          });
        return;
      } else {
        res.status(200)
          .send({
            message: "User Registered successfully"
          })
      }
    });
  };
  
const signin = (req, res) => {
    User.findOne({
        email: req.body.email
      })
      .then((user, err) => 
      {
        if (err) {
          res.status(500)
            .send({
              message: err
            });
          return;
        }
        if (!user) {
          return res.status(404)
            .send({
              message: "User Not found."
            });
        }
  
        //comparing passwords
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
          return res.status(401)
            .send({
              accessToken: null,
              message: "Invalid Password!"
            });
        }
        //signing token with user id
        var token = jwt.sign({
          id: user.id,
          user:user.email,
          role:user.role,
        }, process.env.API_SECRET, {
          expiresIn: "1h"
        });
  
        //responding to client request with user profile success message and  access token .
        res.status(200)
          .send({
            user: {
              id: user._id,
              email: user.email,
              fullName: user.fullName,
            },
            message: "Login successfull",
            accessToken: token,
          });
      });
  };

route.post("/register", signup, function (req, res) {

});

route.post("/login", signin, function (req, res) {

});

export default route;