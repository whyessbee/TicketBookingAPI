import express from "express";
import Ticket from "../Models/Ticket.js";
import User from "../Models/User.js";
import verifyToken from "../lib/verify.controller.js";
import ReviewModel from "../Models/Review.js"

const route = express.Router();

/**
 * 1.EP for posting a review
 * 2. EP for fetching all the reviews
 */
route.get('/review/all',verifyToken,(req,res,next)=>{
    ReviewModel.find({}).then((data)=>{
        if(data.length>0){
            res.status(200).send(data);
        }
        else
        res.status(200).send('No data found!!!!');
    }).catch(err=>{
        next(err);
    })
})

route.post('/review/:ticketid',verifyToken,(req,res,next)=>{
    Ticket.find({_id:req.params.ticketid}).then((data)=>{
        if(data){
        let reviewModel=new ReviewModel({
            UserId: req.id,
        Review: req.body.Review,
        Rating: req.body.Rating,
        TicketId: req.params.ticketid
        })
    
        reviewModel.save().then(data=>{
            res.status(200).send({'Status':'Rating Submitted Successfully'});
        }).catch((err)=>{
            next(err);
        })
    }
    else
    res.status(200).send('No Ticket Found')
    })
    
})



export default route;