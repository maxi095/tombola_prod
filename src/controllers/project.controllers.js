import Project from '../models/project.model.js';

export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({})
            .populate('user')
            .populate('dimension'); // Asegúrate de que 'dimension' sea correcto
        res.json(projects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const { name, description, dimension } = req.body;  // Cambiar 'project' por 'dimension'
        const newProject = new Project({
            name,
            description,
            user: req.user.id,
            dimension // Asegúrate de que el campo aquí sea correcto
        });
        const savedProject = await newProject.save();
        res.json(savedProject);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('user')
            .populate('dimension'); // Asegúrate de que 'dimension' sea correcto
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        return res.status(204).json({ message: 'Project deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('user')
            .populate('dimension'); // Asegúrate de que 'dimension' sea correcto
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
