import Ticket from '../models/ticketModel';
import initDB from '../utils/connectDB';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    await Ticket.find({
        projectId: id
    }).then((doc) => {
        console.log(doc);
        res.status = 200;
        res.header = 'Content-Type: application/json';
        res.json(doc);
    }).catch(err => {
        console.log(err);
    });

}