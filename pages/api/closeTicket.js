import Ticket from '../../models/ticketModel';
import initDB from '../../utils/connectDB';
import mongoose from 'mongoose';
import Project from '../../models/projectModel'

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const prev = req.body.prevState;
    const ticket = await Ticket.findOne({
        _id: id
    });

    if (ticket) {
        ticket.currentStatus = 'closed';
        ticket.tags.push('resolved');
    }

    const project = await Project.findOne({
        _id: ticket.projectId
    });

    project.resolvedTickets += 1;

    switch(prev) {
        case 'New': project.newTickets -= 1; break;
        case 'Triaged': project.triagedTickets -= 1; break;
        case 'Accepted': project.acceptedTickets -= 1; break;
        case 'Pending': project.pendingTickets -= 1; break;
        case 'Unresolved': project.unresolvedTickets -= 1; break;
    }

    await project.save().then().catch();

    await ticket.save().then(doc => {
        console.log(doc);
        res.json(doc)
    }).catch(err => {
        console.log('Ticket closing error');
    })
}