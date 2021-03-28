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
        type: mongoose.Types.ObjectId,
        ref: 'Project',
        role_in_project: {
            type: String,
            required: true
        }
    }]

}, { timestamps: {
    createdAt: 'created_at' 
}}
);


export default mongoose.models.User || mongoose.model('User', userSchema);