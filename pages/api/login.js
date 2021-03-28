import User from '../models/userModel';
import initDB from '../utils/connectDB';
const jwt = require('jsonwebtoken');


initDB();
export default async(req, res) => {

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    });

    if (!user) return res.json('User not found!')

    jwt.sign({
        userId: user._id,
        email: user.email,
        username: user.username
    }, 'jwtsecret', (err, token) => {
        if (err) return res.status(500).json('Internal Server Error');
        res.status(200).json({
            accessToken: token,
            expiresIn: '1h',
            tokenType: 'Bearer'
        })
    });


}