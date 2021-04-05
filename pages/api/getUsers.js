import User from '../../models/userModel';
import initDB from '../../utils/connectDB';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

initDB();
export default async (req, res) => {
    const accessToken = req.headers.accesstoken.split(' ')[1];
    const decoded = jwt.verify(accessToken, 'jwtsecret');
    if (decoded) {
        const users = await User.find();
        var usernames = [];
        const projectId = mongoose.Types.ObjectId(JSON.parse(req.body).projectId)
        users.forEach(user => {
            if (!user.in_projects.includes(projectId)) {
            usernames.push(user.username);
            }
        });

            res.json(usernames);
          }
    }