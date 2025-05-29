import User from '../models/user.model.js';
import Person from '../models/person.model.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('email username roles person') // ya no incluimos datos personales
            .populate('person') // traemos la persona vinculada         
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener un usuario específico
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('email username roles person')
            .populate('person')
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crear nuevo usuario
export const createUser = async (req, res) => {
    try {
        const {
            username, email, password, roles,
            firstName, lastName, address, phone, document
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear la persona primero
        const newPerson = new Person({
            firstName,
            lastName,
            document,
            address,
            phone,
            email,
        });

        const savedPerson = await newPerson.save();

        // Crear el usuario con referencia a la persona
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            roles,
            person: savedPerson._id
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { roles, person: personUpdates } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (roles) user.roles = roles;

        await user.save();

        // Si también se quiere actualizar la persona vinculada:
        if (personUpdates && user.person) {
            await Person.findByIdAndUpdate(user.person, personUpdates);
        }

        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Eliminar usuario y opcionalmente su persona
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Si querés eliminar también la persona asociada (opcional y peligroso si hay cliente/vendedor usando esa persona)
        // await Person.findByIdAndDelete(user.person);

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
