import Installment from '../models/installment.model.js';

// Obtener todas las cuotas
export const getInstallments = async (req, res) => {
    try {
        const installments = await Installment.find().populate(['sale', 'user']);
        res.json(installments);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener una cuota por ID
export const getInstallment = async (req, res) => {
    try {
        const installment = await Installment.findById(req.params.id).populate(['sale', 'user']);
        if (!installment) return res.status(404).json({ message: 'Installment not found' });
        res.json(installment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Crear una nueva cuota
export const createInstallment = async (req, res) => {
    try {
        const { sale, installmentNumber, dueDate, amount, paymentDate, paymentMethod, status } = req.body;

        const newInstallment = new Installment({
            sale,
            installmentNumber,
            dueDate,
            amount,
            paymentDate,
            paymentMethod,
            status,
            user: req.user.id
        });

        const savedInstallment = await newInstallment.save();
        res.json(savedInstallment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Editar una cuota
export const updateInstallment = async (req, res) => {
    try {
        const installment = await Installment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(['sale', 'user']);
        if (!installment) return res.status(404).json({ message: 'Installment not found' });
        res.json(installment);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Eliminar una cuota
export const deleteInstallment = async (req, res) => {
    try {
        const installment = await Installment.findByIdAndDelete(req.params.id);
        if (!installment) return res.status(404).json({ message: 'Installment not found' });

        res.status(204).json({ message: 'Installment deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
