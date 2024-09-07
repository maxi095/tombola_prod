import mongoose from "mongoose";

const academicUnitSchema = new mongoose.Schema( {
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
})

export default mongoose.model('AcademicUnit', academicUnitSchema)