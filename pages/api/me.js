import User from '../../models/userModel';
import initDB from '../../utils/connectDB';
const jwt = require('jsonwebtoken');


initDB();
export default async(req, res) => {
    const accessToken = req.headers.accesstoken.split(' ')[1];

    const decoded = jwt.verify(accessToken, 'jwtsecret') 
    const user = await User.findOne({
      username: decoded.username
    });
    res.json(user);  
}