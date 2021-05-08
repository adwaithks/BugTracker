import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    participants: [{
        name: String,
        permission: String
    }],
    participant_names: [String],
    newTickets: {
        type: Number
    },
    resolvedTickets: {
        type: Number
    },
    triagedTickets: {
        type: Number
    },
    pendingTickets: {
        type: Number
    },
    unresolvedTickets: {
        type: Number
    },
    acceptedTickets: {
        type: Number
    }
},{ timestamps: {
    createdAt: 'created_at' 
}});


export default mongoose.models.Project || mongoose.model('Project', projectSchema);