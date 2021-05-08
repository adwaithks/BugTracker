import Project from '../../models/projectModel';
import initDB from '../../utils/connectDB';
import mongoose from 'mongoose';

initDB();

export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const project = await Project.findOne({
        _id: id
    });

    project.participants.map((each, index) => {
        if (each.name.toLowerCase() == req.body.user.name.toLowerCase()) {
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