import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: false,
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    document: {
        type: Number,
        required: false,
    },
    academicUnit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademicUnit',
        required: false,
    },
    roles: {  
        type: String,
        enum: ['Estudiante', 'Director', 'Secretario', 'Administrador'],  
        default: 'Estudiante'
    }
}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);
