import Person from '../models/person.model.js';

export const getPeople = async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPerson = async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);
        if (!person) return res.status(404).json({ message: 'Person not found' });
        res.json(person);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePerson = async (req, res) => {
    try {
        const updated = await Person.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Person not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePerson = async (req, res) => {
    try {
        const deleted = await Person.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Person not found' });
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
