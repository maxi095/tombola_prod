import mongoose from "mongoose";

const installmentSchema = new mongoose.Schema({
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true
    },
    installmentNumber: {
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
        enum: ['Efectivo', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencia', 'Otros']
    },
    status: {
        type: String,
        enum: ['Pendiente', 'Pagado', 'Vencido'],
        default: 'Pendiente'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Installment', installmentSchema);
