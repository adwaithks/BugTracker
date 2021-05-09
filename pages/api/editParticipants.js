import Project from '../../models/projectModel';
import initDB from '../../utils/connectDB';
import mongoose from 'mongoose';

initDB();

export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const project = await Project.findOne({
        _id: id
    });

    if (!req.body.newRole || req.body.newRole == "" || req.body.newRole == " ") {
        req.body.newRole = 'triager';
    }

    project.participants.map((each, index) => {
        if (each.email.toLowerCase() == req.body.user.email.toLowerCase()) {
            console.log('newrole: ' + req.body.newRole.split(" ").join("").toLowerCase());
            project.participants[index].permission = req.body.newRole.split(" ").join("").toLowerCase();
        }
    })
    
    await project.save().then(doc => {
        console.log('project saved successfully!!!')
        res.status(200).json(doc);
    }).catch(err => {
        console.log('projects.save() err');
    });
}