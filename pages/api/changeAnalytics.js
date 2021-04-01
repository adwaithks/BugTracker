import analyticModel from '../models/analyticsModel';
import initDB from '../utils/connectDB';


initDB();
export default async (req, res) => {
    const sign = req.body.sign;
    const count = req.body.count;
    const category = req.body.category;
}