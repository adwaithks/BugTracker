import Ticket from '../models/ticketModel';
import initDB from '../utils/connectDB';
import mongoose from 'mongoose';
import Project from '../models/projectModel';

initDB();
export default async(req, res) => {

    const analyticsMatch = {
        'New' : 'newTickets',
        'Triaged' : 'triagedTickets',
        'Accepted' : 'acceptedTickets',
        'Pending' : 'pendingTickets',
        'Unresolved' : 'unresolvedTickets',
        'Resolved' : 'resolvedTickets'
    }
    const id = mongoose.Types.ObjectId(req.body.id);

    const ticket = await Ticket.findOne({
        _id: id
    });
    ticket.currentStatus = req.body.currentState;

    const project = await Project.findOne({
        _id: ticket.projectId
    });

    const currentState = req.body.currentState;
    const prev = req.body.prevState;

    switch(currentState) {
        case 'New': project.newTickets += 1; break;
        case 'Triaged': project.triagedTickets += 1; break;
        case 'Accepted': project.acceptedTickets += 1; break;
        case 'Pending': project.pendingTickets += 1; break;
        case 'Unresolved': project.unresolvedTickets += 1; break;
        case 'Resolved': project.resolvedTickets += 1; break;
    }

    switch(prev) {
        case 'New': project.newTickets -= 1; break;
        case 'Triaged': project.triagedTickets -= 1; break;
        case 'Accepted': project.acceptedTickets -= 1; break;
        case 'Pending': project.pendingTickets -= 1; break;
        case 'Unresolved': project.unresolvedTickets -= 1; break;
        case 'Resolved': project.resolvedTickets -= 1; break;
    }

    await project.save().then().catch();
    
    await ticket.save().then((doc) => {
        console.log(doc);
        res.json(doc);
    }).catch(err => {
        console.log('err');
    });

}