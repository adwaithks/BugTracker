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

    const user = await User.findOne({
        email: req.body.name
    });
    if (!user) {
        console.log('no such user')
        return res.status(404).json({
            message: 'No such user. Not able to add to project'
        });
    }


    project.participants.map(each => {
        if (each.email === req.body.myEmail && (each.permission === 'projectlead' || each.permission === 'admin')) {
            console.log('pushing new participant: ' + user.username)
            project.participants.push({
                email: req.body.name,
                name: user.username,
                permission: req.body.permission
            });
            
            project.participant_names.push(user.username);
        }
    })

    
    const response_participant = project.participants[project.participants.length - 1];

    user.in_projects.push(req.body.projectId);
    await user.save().then().catch(err => {
        console.log('user.in_projects err');
    });

    await project.save().then(doc => {
        console.log('project saved successfully!!!')
        res.status(200).json(response_participant);
    }).catch(err => {
        console.log('projects.save() err');
    });

}