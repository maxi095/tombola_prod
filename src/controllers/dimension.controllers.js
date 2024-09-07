import Dimension from '../models/dimension.models.js';

export const getDimensions = async (req, res) => {
    try {
        const dimensions = await Dimension.find({}).populate('user'); // Populate para incluir detalles del usuario si es necesario
        res.json(dimensions);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createDimension = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newDimension = new Dimension({
            name,
            description,
            user: req.user.id
        });
        const savedDimension = await newDimension.save();
        res.json(savedDimension);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDimension = async (req, res) => {
    try {
        const dimension = await Dimension.findById(req.params.id).populate('user');
        if (!dimension) return res.status(404).json({ message: 'Dimension not found' });
        res.json(dimension);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteDimension = async (req, res) => {
    try {
        const dimension = await Dimension.findByIdAndDelete(req.params.id);
        if (!dimension) return res.status(404).json({ message: 'Dimension not found' });
        return res.status(204).json({ message: 'Dimension deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateDimension = async (req, res) => {
    try {
        const dimension = await Dimension.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user');
        if (!dimension) return res.status(404).json({ message: 'Dimension not found' });
        res.json(dimension);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
