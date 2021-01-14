import initDB from '../utils/connectDB';
import Ticket from '../models/ticketModel';
import mongoose from 'mongoose';

initDB();
export default async (req, res) => {
    const id = mongoose.Types.ObjectId(req.body.projectId);
    const ticket = new Ticket({
        title: req.body.title,
        projectId: id,
        description: req.body.description,
        participants: req.body.participants,
        author: req.body.author,
        project: req.body.project
    });
    console.log('ticket: ' + ticket);
    await ticket.save().then((doc) => {
        res.status = 200;
        res.header = 'Content-Type: application/json';
        res.json(doc);
    }).catch(err => {
        console.log('err');
    })
}