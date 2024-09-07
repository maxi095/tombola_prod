import ActivityProject from '../models/activityProject.model.js';
import User from '../models/user.model.js';
import Project from '../models/project.model.js'; // Asegúrate de tener el modelo Project importado

export const getActivityProjects = async (req, res) => {
    try {
        const activities = await ActivityProject.find().populate('project').populate('user');
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createActivityProject = async (req, res) => {
    const { name, description, project, hours } = req.body;

    try {
        const foundProject = await Project.findById(project);
        if (!foundProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newActivityProject = new ActivityProject({
            name,
            description,
            project,
            hours,
            user: req.user.id // Asumiendo que tienes autenticación y el usuario está en req.user
        });

        const savedActivityProject = await newActivityProject.save();
        res.status(201).json(savedActivityProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getActivityProject = async (req, res) => {
    try {
        const activityProject = await ActivityProject.findById(req.params.id).populate('project').populate('user');
        if (!activityProject) return res.status(404).json({ message: 'Activity not found' });
        res.json(activityProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteActivityProject = async (req, res) => {
    try {
        const activityProject = await ActivityProject.findByIdAndDelete(req.params.id);
        if (!activityProject) return res.status(404).json({ message: 'Activity not found' });
        return res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateActivityProject = async (req, res) => {
    const { name, description, project, hours } = req.body;

    try {
        const activityProject = await ActivityProject.findById(req.params.id);
        if (!activityProject) return res.status(404).json({ message: 'Activity not found' });

        // Actualizar solo los campos proporcionados
        activityProject.name = name !== undefined ? name : activityProject.name;
        activityProject.description = description !== undefined ? description : activityProject.description;
        activityProject.project = project !== undefined ? project : activityProject.project;
        activityProject.hours = hours !== undefined ? hours : activityProject.hours;

        const updatedActivityProject = await activityProject.save();
        res.json(updatedActivityProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
