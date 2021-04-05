import Project from '../../models/projectModel';
import initDB from '../../utils/connectDB';

initDB();
export default async(req, res) => {
    const projects = await Project.find();
    res.json(projects);
}