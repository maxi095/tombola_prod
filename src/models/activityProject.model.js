import mongoose from "mongoose";

const activityProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId, // Referencia al modelo Project
        ref: 'Project',
        required: true,
    },
    dateActivity: {
        type: Date,
        required: true,
    },
    hours: {
        type: Number, // Almacena las horas como un número entero
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model('ActivityProject', activityProjectSchema);
