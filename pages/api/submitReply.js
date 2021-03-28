import initDB from '../utils/connectDB';
import Ticket from '../models/ticketModel';
import mongoose from 'mongoose';

initDB();

var datesToJS = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul', 
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
}

export default async (req, res) => {
    const id = mongoose.Types.ObjectId(req.body.id);
    var date = new Date().toLocaleDateString("en-US").split("/");
    var finalDate = date[1].toString() + ' ' + datesToJS[date[0]] + ' ' + date[2].toString()
    var name = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1)
    
        const reply = {
            action: req.body.action,
            user: name,
            reply: req.body.reply,
            date: finalDate
        };
        try {
            if (req.body.action == 1) {
                reply['tags'] = req.body.tagData;
            }
        }catch(err){
            console.log('errrr');
        }
        
        const ticket = await Ticket.findOne({
            _id: id
        });
        await ticket.replies.push(reply);
        await ticket.save().then((doc) => {
            res.status = 200;
            res.json(doc);
        }).catch(err => {
            console.log('ererr');
        });
    
    
}