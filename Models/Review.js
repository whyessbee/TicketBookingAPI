/**
 * 1.UserId
 * 2. Review description
 * 3. Rating [1-10]
 * 4.Ticket Id
 * use authentication and auth.
 */

import mongoose from 'mongoose'


const ReviewSchema = mongoose.Schema({
   UserId: { type: String },
    Review: { type: String, },
    Rating: { type: Number, min:1, max:10},
    TicketId: { type:String }
})

export default  mongoose.model('Review',ReviewSchema)