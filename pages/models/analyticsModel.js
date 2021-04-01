const mongoose = require('mongoose');

const analyticSchema = mongoose.Schema({
    title: {
        type: String,
        default: 'analytics'
    },
    newTickets: {
        type: Number,
        default: 0
    },
    triagedTickets: {
        type: Number,
        default: 0
    },
    resolvedTickets: {
        type: Number,
        default: 0
    },
    unresolvedTickets: {
        type: Number,
        default: 0
    },
    issuesReceivedNum: {
        type: Number,
        default: 0
    },
    issuesReceivedChart: [Number],
    overallTickettypeChart: [Number]
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

export default mongoose.models.Analytics || mongoose.model('Analytics', analyticSchema);