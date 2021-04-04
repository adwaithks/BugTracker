import Ticket from '../models/ticketModel';
import initDB from '../utils/connectDB';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const ticket = await Ticket.findOne({
        _id: id
    });
    res.status = 200;
    res.header = 'Content-Type: application/json';
    res.json(ticket);
}