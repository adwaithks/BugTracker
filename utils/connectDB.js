import mongoose from 'mongoose';
require('mongoose').config();

const initDB = () => {
    if (mongoose.connections[0].readyState){
        console.log('Already Connected')
        return
    }
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {

    }).catch(err => {

    });
}

export default initDB;
