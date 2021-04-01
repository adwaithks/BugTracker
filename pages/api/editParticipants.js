import initDB from '../utils/connectDB';
import Project from '../models/projectModel';
import mongoose from 'mongoose';
import User from '../models/userModel';

initDB();
export default async (req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const participants = req.body.participants;
    const project = await Project.findOne({
        _id: id
    });
    const users = await User.find({
        "username": { $in : participants }
    });
    users.forEach( async each => {
        if (!each.in_projects.includes(id)) {
            each.in_projects.push(id);
        }
        await each.save().then().catch();
    });
    project.participants = participants;
    await project.save().then(doc => {
        return res.json(doc);
    }).catch(err => {
        console.log('new err');
    });
    
}