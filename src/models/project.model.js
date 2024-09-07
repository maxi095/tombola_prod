import mongoose from "mongoose";

const projectSchema = new mongoose.Schema( {
    name: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
        require: true,
        trim: true,
        unique: false
    },
    dimension: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dimension',  
        required: true,  
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
})

export default mongoose.model('Project', projectSchema)