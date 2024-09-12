import { date } from 'zod';
import Activity from '../models/activity.model.js';
import User from '../models/user.model.js';

// Obtener todas las actividades
export const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate('studentId', 'username email firstName lastName') // Traemos solo los campos que nos interesan del usuario
            .populate({
                path: 'activityProjectId', // Población de activityProjectId
                populate: {
                    path: 'project', // Población de la referencia al proyecto
                    select: 'name', // Solo selecciona el campo 'name'
                },
            });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear una nueva actividad
export const createActivity = async (req, res) => {
    const { studentId, activityProjectId } = req.body;
    // console.log( "Estudiante: ", studentId, " Actividad: ", activityProjectId, studentId, " Fecha actividad: ", dateActivity)
    if (!studentId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Verifica si el usuario existe
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Crea la nueva actividad
        const newActivity = new Activity({
            studentId: user._id,
            activityProjectId,
            user: req.user.id // El usuario que está creando la actividad
        });

        const savedActivity = await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (error) {
        console.error("Error creating activity:", error);  // Agrega esto para depuración
        res.status(400).json({ message: error.message });
    }
};


// Obtener una actividad por ID
export const getActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.id)
        .populate({
            path: 'studentId',
            select: 'username email firstName lastName',
            populate: {
            path: 'academicUnit', // Población de la referencia a la unidad académica
            select: 'name', // Selecciona el campo 'name' de la unidad académica
            }
        })
        .populate({
            path: 'activityProjectId',
            populate: {
            path: 'project',
            select: 'name',
            }
        });
        if (!activity) return res.status(404).json({ message: 'Activity not found' });
        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una actividad por ID
export const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });
        return res.sendStatus(204); // Respuesta sin contenido al eliminar
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una actividad por ID
export const updateActivity = async (req, res) => {
    const { studentId, activityProjectId, ...updateData } = req.body;

    if (!studentId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Verifica si el usuario existe si se proporciona un studentId
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        updateData.studentId = user._id; // Asigna el ID del estudiante

        if (activityProjectId) {
            updateData.activityProjectId = activityProjectId; // Asigna el ID del proyecto de actividad
        }

        const activity = await Activity.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!activity) return res.status(404).json({ message: 'Activity not found' });

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nuevo endpoint: Obtener actividades por ID de usuario
export const getActivitiesByUser = async (req, res) => {
    try {
        const activities = await Activity.find({ studentId: req.params.userId })
            .populate('studentId', 'username email firstName lastName') // Población del usuario
            .populate({
                path: 'activityProjectId',
                populate: {
                    path: 'project',
                    select: 'name',
                }
            });

        // Devuelve un array vacío si no hay actividades, pero con un código de estado 200 OK
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsersByActivity = async (req, res) => {
    const { activityId } = req.params;
    try {
        // Encuentra todas las actividades relacionadas con el activityId proporcionado
        const activities = await Activity.find({ activityProjectId: activityId }).populate('studentId');

        // Extrae los IDs de usuario únicos de las actividades encontradas
        const userIds = [...new Set(activities.map(activity => activity.studentId._id.toString()))];

        // Encuentra los usuarios por los IDs obtenidos
        const users = await User.find({ _id: { $in: userIds } });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users by activity:", error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};
