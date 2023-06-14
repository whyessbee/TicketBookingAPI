import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Entry Point for the request
 */
try {
    const app=express()
    app.use(bodyparser.json());
   // app.use('/api',apiroutes);

    mongoose.connect(process.env.DB_CONNECTION,{ useNewUrlParser: true });

    mongoose.connection
    .once('open',()=>console.log('Connection established!!!!'))
    .on('error',(error)=>console.error('Error observed',error));

    app.listen(process.env.PORT || 3003,()=>{console.log('Listening on port '+process.env.PORT)});
    
} catch (error) {
    console.error('Error in execution',error);
    throw error;
}

