import User from '../models/userModel';
import initDB from '../utils/connectDB';
const jwt = require('jsonwebtoken');


initDB();
export default async(req, res) => {
    const accessToken = req.headers.accesstoken.split(' ')[1];
    jwt.verify(accessToken, 'jwtsecret', async (err, decoded) => {
        if (err) return res.status(403).json('Invalid Authorization Token');
        const user = await User.findOne({
          username: decoded.username
        });
        res.json(user);
      });     
}