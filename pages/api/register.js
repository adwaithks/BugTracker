import User from '../../models/userModel';
import initDB from '../../utils/connectDB';

initDB();
export default async(req, res) => {

    const user = await User.findOne({
        username: req.body.username
    });
    if (user) return  res.status(503).json({
        success: 'Username already exists'
    });

    const user = await User.findOne({
        email: req.body.email
    });
    if (user) return  res.status(503).json({
        success: 'Email already exists'
    });

    const new_user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    await new_user.save().then(doc => {
        res.status(200).json({
            success: 'Registration Successfull'
        })
    }).catch(err => {
        console.log('Register Error');
    })
}