import Ticket from '../models/ticketModel';
import initDB from '../utils/connectDB';

initDB();
export default async(req, res) => {
    const ticket = await Ticket.find();
    res.json(ticket);
}