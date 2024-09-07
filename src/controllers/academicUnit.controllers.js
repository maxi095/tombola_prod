import AcademicUnit from '../models/academicUnit.model.js';

export const getAcademicUnits = async (req, res) => {
    try {
        const academicUnits = await AcademicUnit.find({}).populate('user'); // Populate para incluir detalles del usuario si es necesario
        res.json(academicUnits);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createAcademicUnit = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newAcademicUnit = new AcademicUnit({
            name,
            description,
            user: req.user.id
        });
        const savedAcademicUnit = await newAcademicUnit.save();
        res.json(savedAcademicUnit);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAcademicUnit = async (req, res) => {
    try {
        const academicUnit = await AcademicUnit.findById(req.params.id).populate('user');
        if (!academicUnit) return res.status(404).json({ message: 'Academic Unit not found' });
        res.json(academicUnit);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteAcademicUnit = async (req, res) => {
    try {
        const academicUnit = await AcademicUnit.findByIdAndDelete(req.params.id);
        if (!academicUnit) return res.status(404).json({ message: 'Academic Unit not found' });
        return res.status(204).json({ message: 'Academic Unit deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateAcademicUnit = async (req, res) => {
    try {
        const academicUnit = await AcademicUnit.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user');
        if (!academicUnit) return res.status(404).json({ message: 'Academic Unit not found' });
        res.json(academicUnit);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
