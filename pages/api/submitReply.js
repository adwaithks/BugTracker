import initDB from '../utils/connectDB';
import Ticket from '../models/ticketModel';
import mongoose from 'mongoose';

initDB();
export default async (req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const reply = {
        user: req.body.name,
        reply: req.body.reply
    };
    const ticket = await Ticket.findOne({
        _id: id
    });
    await ticket.replies.push(reply);
    await ticket.save().then((doc) => {
        res.status = 200;
        res.header = 'Content-Type: application/json';
        res.json(doc);
    }).catch(err => {
        console.log('err');
    });
    
}