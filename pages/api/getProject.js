import Project from '../models/projectModel';
import initDB from '../utils/connectDB';
import mongoose from 'mongoose';

initDB();
export default async(req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    console.log('id: ' + id);
    await Project.findOne({
        _id: id
    }).then((doc) => {
        res.status = 200;
        res.header = 'Content-Type: application/json';
        res.json(doc)
    }).catch(err => {
        console.log(err);
    });

}