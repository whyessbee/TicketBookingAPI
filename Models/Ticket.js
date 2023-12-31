import mongoose from 'mongoose'


const TicketSchema = mongoose.Schema({
    seat_number: { type: Number, min: 1, max: 40, required: true,unique:true },
    is_booked: { type: Boolean, default: true },
    date: { type: Date, default: Date.now() },
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export default  mongoose.model('Ticket',TicketSchema)