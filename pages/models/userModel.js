import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    in_projects: [{
        type: mongoose.Types.ObjectId,
        ref: 'Project'
    }],
    raised_tickets: [{
        type: mongoose.Types.ObjectId,
        ref: 'Ticket'
    }],
    leading_projects: [{
        type: mongoose.Types.ObjectId,
        ref: 'Project'
    }],
    roles: [{
        permissions: [String],
        projectId: {
            type: mongoose.Types.ObjectId,
            ref: 'Project'
        }
    }]

}, { timestamps: {
    createdAt: 'created_at' 
}}
);


export default mongoose.models.User || mongoose.model('User', userSchema);