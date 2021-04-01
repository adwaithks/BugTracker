import Analytics from '../models/analyticsModel';
import initDB from '../utils/connectDB';
import Project from '../models/projectModel';

initDB();
export default async (req, res) => {

    const analyticsMatch = {
        newTickets: 0,
        triagedTickets: 0,
        acceptedTickets: 0,
        pendingTickets: 0,
        resolvedTickets: 0,
        unresolvedTickets: 0,
        issuesReceivedNum: 0,
        issuesReceivedChart: [],
        overallTickettypeChart: []
    } 
    const projects = await Project.find({
        author: req.body.user
    });
    projects.forEach(project => {
        analyticsMatch.newTickets += project.newTickets;
        analyticsMatch.triagedTickets += project.triagedTickets;
        analyticsMatch.acceptedTickets += project.acceptedTickets;
        analyticsMatch.pendingTickets += project.pendingTickets;
        analyticsMatch.unresolvedTickets += project.unresolvedTickets;
        analyticsMatch.resolvedTickets += project.resolvedTickets;
    }); 
    // 'New', 'Triaged', 'Accepted', 'Pending', 'Resolved', 'Unresolved'],


    projects.forEach(each => {
        analyticsMatch.issuesReceivedNum = analyticsMatch.issuesReceivedNum  + each.newTickets + each.triagedTickets + each.acceptedTickets + each.pendingTickets + each.unresolvedTickets + each.resolvedTickets
    });
    analyticsMatch.issuesReceivedChart = [analyticsMatch.newTickets, analyticsMatch.triagedTickets, analyticsMatch.acceptedTickets, analyticsMatch.pendingTickets, analyticsMatch.resolvedTickets, analyticsMatch.unresolvedTickets]
    analyticsMatch.overallTickettypeChart = [analyticsMatch.newTickets, analyticsMatch.triagedTickets, analyticsMatch.acceptedTickets, analyticsMatch.pendingTickets, analyticsMatch.resolvedTickets, analyticsMatch.unresolvedTickets]
    res.json(analyticsMatch);
}