import Project from '../../models/projectModel';
import initDB from '../../utils/connectDB';
import User from '../../models/userModel';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const project_id = mongoose.Types.ObjectId(req.body.projectId);
    const project = await Project.findOne({
        _id: project_id
    });
    const user = await User.findOne({
        username: req.body.deletename
    });

    if (!user) {
        return res.json({
            comment: `${user.username} was not removed from ${project.title}` 
        })
    }

    project.participants.map((each, index) => {
        if (each.name === req.body.deletename) {
            console.log('person removed from project!');
            project.participants.splice(index, 1);
            project.participant_names.pull(user.username);
        }
    });

    user.in_projects.pull(req.body.projectId);
    await user.save().then().catch(err => {
        return res.json({
            comment: `${user.username} was not removed from ${project.title}` 
        })
    });

    await project.save().then(doc => {
        return res.json({
            comment: `${user.username} was removed from ${project.title}` 
        })
    }).catch(err => {
        return res.json({
            comment: `${user.username} was not removed from ${project.title}` 
        })
    });
}