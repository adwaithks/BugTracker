import initDB from '../utils/connectDB';
import Project from '../models/projectModel';
import mongoose from 'mongoose';

initDB();
export default async (req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const participants = req.body.participants;
    const project = await Project.findOne({
        _id: id
    });
    project.participants = participants;
    await project.save().then(doc => {
        res.json(doc);
    }).catch(err => {
        console.log(err);
    });
    
}