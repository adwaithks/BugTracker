import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    project: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    author: {
        type: String,
        required: true
    },
    replies: [{
        user: String,
        action: Number,
        tags: [String],
        reply: String,
        date: String
    }],
    currentStatus: {
        type: String,
        default: 'New'
    },
    participants: [String],
    resolvedDate: {
        type: Date
    },
    tags: [String]
}, { timestamps: {
    createdAt: 'created_at' 
}}
);


export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);