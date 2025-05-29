import mongoose from "mongoose";

const bingoCardSchema = new mongoose.Schema({
    edition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Edition',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: false
    },
    number: {
        type: Number
    },
    status: {
        type: String,
        enum: ['Disponible', 'Vendido'],
        default: 'Disponible'
    },
    numbers: { 
        type: [Number], 
        default: [] 
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('BingoCard', bingoCardSchema);
