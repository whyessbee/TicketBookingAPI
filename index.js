import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
import route from './routes/operations.js'
import authRoute from './lib/auth.controller.js'
import methodOverride from 'method-override'
dotenv.config();

/**
 * Entry Point for the request
 */
const app=express()
try {
    
    app.use(bodyparser.json());
    app.use('/api',route);
    app.use('/auth',authRoute);
    app.use(methodOverride());
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        next(err);
        res.status(500).send(err.message);
      });
    mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true });

    mongoose.connection
    .once('open',()=>console.log('Connection established!!!!'))
    .on('error',(error)=>console.error('Error observed',error));

    app.listen(process.env.PORT || 3003,()=>{console.log('Listening on port '+process.env.PORT)});
    
} catch (error) {
    console.error('Error in execution',error);
    throw error;
}

export default app;
