import Project from '../../models/projectModel';
import initDB from '../../utils/connectDB';
import User from '../../models/userModel';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.projectId);
    const project = await Project.findOne({
        _id: id
    });
    if (project.author.toLowerCase() != req.body.me.toLowerCase()) {
        return res.status(403).json({message: 'You are not allowed to add participants'})
    }

    if (!project.participants.includes(req.body.name)) {
       project.participants.push(req.body.name);
    }
    const user = await User.findOne({
        username: req.body.name
    });
    if (user) {
        user.in_projects.push(req.body.projectId);
        await user.save().then().catch(err => {
            console.log('user.in_projects err');
        });
    } else {
        console.log('No such user. Not able to add to project')
        return
    }
    

    await project.save().then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        console.log('projects.save() err');
    });

}