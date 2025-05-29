import mongoose from "mongoose";

const quotaSchema = new mongoose.Schema({
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    quotaNumber: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date
    },
    paymentMethod: {
        type: String,
        enum: ['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'],
    }
}, {
    timestamps: true
});

export default mongoose.model('Quota', quotaSchema);
