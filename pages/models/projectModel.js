import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    participants: [String],
    openTickets: {
        type: Number
    },
    closedTickets: {
        type: Number
    },
    resolvedTickets: {
        type: Number
    },
    unresolvedTickets: {
        type: Number
    }
},{ timestamps: {
    createdAt: 'created_at' 
}});


export default mongoose.models.Project || mongoose.model('Project', projectSchema);