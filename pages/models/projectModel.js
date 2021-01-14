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
    participants: [String]
});


export default mongoose.models.Project || mongoose.model('Project', projectSchema);