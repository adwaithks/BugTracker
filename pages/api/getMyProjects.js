import Project from '../models/projectModel';
import initDB from '../utils/connectDB';

initDB();
export default async(req, res) => {
    await Project.find().then((doc) => {
        res.status = 200;
        res.header = 'Content-Type: application/json';
        res.json(doc)
    }).catch(err => {
        console.log(err);
    });

}