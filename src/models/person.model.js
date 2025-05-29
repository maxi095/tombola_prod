import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    document: {
        type: String,
        required: false,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

export default mongoose.model('Person', personSchema);
