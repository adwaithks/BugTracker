import mongoose from 'mongoose';

const initDB = () => {
    if (mongoose.connections[0].readyState){
        console.log('Already Connected')
        return
    }

    mongoose.connect('', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {

    }).catch(err => {

    });
}

export default initDB;
