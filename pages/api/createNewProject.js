import initDB from '../utils/connectDB';
import Project from '../models/projectModel';
import User from '../models/userModel';

initDB();
export default async (req, res) => {
    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        participants: req.body.participants,
        author: req.body.author,
        newTickets: 0,
        triagedTickets: 0,
        acceptedTickets: 0,
        pendingTickets: 0,
        triagedTickets: 0,
        resolvedTickets: 0,
        unresolvedTickets: 0,
    });

    const user = await User.findOne({
        username: req.body.author
    });

    const users = await User.find({
        "username": {$in : req.body.participants}
    });
    users.forEach( async eachUser => {
        eachUser.in_projects.push(project._id);
        await eachUser.save().then().catch();
    });

    user.leading_projects.push(project._id);

    await user.save().then().catch(err => {
        console.log('err');
    });

    await project.save().then((doc) => {
        res.status = 200;
        res.header = 'Content-Type: application/json';
        res.json(doc);
    }).catch(err => {
        console.log('err');
    })
}