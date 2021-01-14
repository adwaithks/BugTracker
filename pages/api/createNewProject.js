import initDB from '../utils/connectDB';
import Project from '../models/projectModel';

initDB();
export default async (req, res) => {
    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        participants: req.body.participants
    });
    await project.save().then((doc) => {
        res.status = 200;
        res.header = 'Content-Type: application/json';
        res.json(doc);
    }).catch(err => {
        console.log('err');
    })
}