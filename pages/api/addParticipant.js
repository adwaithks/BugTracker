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


    project.participants.map(each => {
        if (each.name === req.body.me && (each.permission === 'projectlead' || each.permission === 'admin')) {
            console.log('pushing new participant')
            project.participants.push({
                name: req.body.name,
                permission: req.body.permission
            });
            project.participant_names.push(req.body.name);
        }
    })

    const user = await User.findOne({
        username: req.body.name
    });

    if (user) {
        user.in_projects.push(req.body.projectId);
        await user.save().then().catch(err => {
            console.log('user.in_projects err');
        });
    } else {
        console.log('No such user. Not able to add to project');
        return
    }
    

    await project.save().then(doc => {
        console.log('project saved successfully!!!')
        res.status(200).json(doc);
    }).catch(err => {
        console.log('projects.save() err');
    });

}