import mongoose from 'mongoose';

const initDB = () => {
    if (mongoose.connections[0].readyState){
        console.log('Already Connected')
        return
    }

    mongoose.connect('mongodb+srv://ruby:ruby@cluster0.pfsz5.mongodb.net/Cluster0?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {

    }).catch(err => {

    });
}

export default initDB;