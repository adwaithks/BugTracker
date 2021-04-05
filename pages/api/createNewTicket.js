import initDB from '../../utils/connectDB';
import Ticket from '../../models/ticketModel';
import mongoose from 'mongoose';
import Project from '../../models/projectModel';
import User from '../../models/userModel';

initDB();
export default async (req, res) => {
    
    const id = mongoose.Types.ObjectId(req.body.projectId);

    const ticket = new Ticket({
        title: req.body.title,
        projectId: id,
        description: req.body.description,
        participants: req.body.participants,
        author: req.body.author,
        project: req.body.project,
    });

    const project = await Project.findOne({
        _id: id
    });
    project.newTickets += 1;
    await project.save().then().catch();
    const user = await User.findOne({
        username: req.body.author
    });
    user.raised_tickets.push(ticket._id);
    

    await user.save().then().catch();

    await ticket.save().then((doc) => {
        res.status = 200;
        res.json(doc);
    }).catch(err => {
        console.log('err');
    });
    
}