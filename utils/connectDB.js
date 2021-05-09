import mongoose from 'mongoose';

const initDB = () => {
    if (mongoose.connections[0].readyState){
        console.log('Already Connected')
        return
    }

<<<<<<< HEAD
    mongoose.connect('mongodb+srv://ruby:ruby@cluster0.pfsz5.mongodb.net/Cluster0?retryWrites=true&w=majority', {
=======
    mongoose.connect('', {
>>>>>>> ae723b891441398f49005637ddfa055c7d352314
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {

    }).catch(err => {

    });
}

export default initDB;
