import Ticket from '../models/ticketModel';
import initDB from '../utils/connectDB';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    console.log('ticketid: ' + id);
    
    const ticket = await Ticket.findOne({
        _id: id
    });
    ticket.tags = req.body.tagData;
    await ticket.save().then((doc) => {
        res.json(doc)
    }).catch(err => {
        console.log('err');
    });

}