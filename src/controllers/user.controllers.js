import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios con campos específicos y población de la unidad académica
export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('email username firstName lastName academicUnit document roles') // Seleccionar solo los campos necesarios
            .populate('academicUnit', 'name'); // Poblar el campo academicUnit con el nombre de la unidad académica
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getStudents = async (req, res) => {
    try {
        const users = await User.find({roles: 'Estudiante'})
            .select('email username firstName lastName academicUnit document roles') // Seleccionar solo los campos necesarios
            .populate('academicUnit', 'name'); // Poblar el campo academicUnit con el nombre de la unidad académica
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDirectors = async (req, res) => {
    try {
        const users = await User.find({roles: 'Director'})
            .select('email username firstName lastName academicUnit document roles') // Seleccionar solo los campos necesarios
            .populate('academicUnit', 'name'); // Poblar el campo academicUnit con el nombre de la unidad académica
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Obtener un usuario específico por ID
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('email username firstName lastName academicUnit document roles') // Seleccionar campos específicos
            .populate('academicUnit', 'name'); // Poblar la unidad académica con su nombre
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    const { username, email, password, firstName, lastName, document, academicUnit, roles } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, firstName, lastName, document, academicUnit, roles });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const createStudent = async (req, res) => {
    const { username, email, password, firstName, lastName, document, academicUnit, roles = 'Estudiante' } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, firstName, lastName, document, academicUnit, roles });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const createDirector = async (req, res) => {
    const { username, email, password, firstName, lastName, document, academicUnit, roles = 'Director' } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword, firstName, lastName, document, academicUnit, roles });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Actualizar un usuario existente
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Si roles se ha proporcionado en el cuerpo, actualízalo
        if (req.body.roles) {
            user.roles = req.body.roles; // Asigna el nuevo arreglo de roles
            await user.save(); // Guarda el usuario actualizado
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send(); // Eliminar con éxito, pero sin contenido
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
