import Project from '../models/projectModel';
import initDB from '../utils/connectDB';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    const project = await Project.findOne({
        _id: id
    });
    res.json(project);

}