import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Relación con el modelo User
        required: true,
    },
    activityProjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityProject',
        required: true,
    },

    dateCreated: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    
    },
    {
    timestamps: true
});

export default mongoose.model('Activity', activitySchema);