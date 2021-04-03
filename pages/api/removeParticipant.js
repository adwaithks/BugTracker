import Project from '../models/projectModel';
import initDB from '../utils/connectDB';
import User from '../models/userModel';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.projectId);
    const project = await Project.findOne({
        _id: id
    });

    project.participants.pull(req.body.removed);
    const user = await User.findOne({
        username: req.body.removed
    });

    if (user && project.author != req.body.removed) {
        user.in_projects.pull(req.body.projectId);
        await user.save().then().catch(err => {
            console.log('err');
        });
    
        await project.save().then(doc => {
            return res.json(doc)
        }).catch(err => {
            console.log('err');
        });
    }
    

}