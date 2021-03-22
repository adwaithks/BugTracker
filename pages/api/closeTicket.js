import Ticket from '../models/ticketModel';
import initDB from '../utils/connectDB';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const ticket = await Ticket.findOne({
        _id: id
    })
    if (ticket) {
        ticket.currentStatus = 'closed';
        ticket.tags.push('resolved');
    }
    await ticket.save().then().catch(err => {
        console.log('Ticket closing error');
    })
}