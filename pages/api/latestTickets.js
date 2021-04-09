import Ticket from '../../models/ticketModel';
import initDB from '../../utils/connectDB';

initDB();
export default async(req, res) => {
    const tickets = await Ticket.find()
    .sort({
      created_at: -1,
    })
    .limit(10);

    res.json(tickets);
}