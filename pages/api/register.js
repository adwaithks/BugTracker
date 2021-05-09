import User from '../../models/userModel';
import initDB from '../../utils/connectDB';

initDB();

function ucfirst(str) {
    let firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1).split(" ").join("");
}

export default async(req, res) => {

    const user = await User.findOne({
        username: req.body.username
    });
    if (user) return  res.status(503).json({
        message: 'Username already exists'
    });

    const useremail = await User.findOne({
        email: req.body.email
    });
    if (useremail) return  res.status(503).json({
        message: 'Email already exists'
    });

    const username = ucfirst(req.body.username);

    const new_user = new User({
        username: username,
        email: req.body.email,
        password: req.body.password
    });

    await new_user.save().then(doc => {
        res.status(200).json({
            message: 'Registration Successfull'
        })
    }).catch(err => {
        console.log('Register Error');
    })
}