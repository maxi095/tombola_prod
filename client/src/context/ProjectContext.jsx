import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProjectsRequest, getProjectRequest, createProjectRequest, updateProjectRequest, deleteProjectRequest } from "../api/project"; // Cambia la ruta a tu API de proyectos

const ProjectContext = createContext();

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjects must be used within a ProjectProvider");
    }
    return context;
};

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]); 
    const [error, setError] = useState(null); // Estado para manejar errores

    const getProjects = useCallback(async () => {
        try {
            const res = await getProjectsRequest();
            setProjects(res.data); // Asegúrate de que 'res.data' sea un arreglo
        } catch (error) {
            setError(error); // Maneja el error
            console.error(error);
        }
    }, []); // Asegúrate de que esto no cambie en futuras renderizaciones

    const getProject = async (id) => {
        try {
            const res = await getProjectRequest(id); // Asegúrate de que esta función esté definida
            return res.data; // Devuelve el proyecto obtenido
        } catch (error) {
            console.error("Error loading project:", error);
            throw error; // Lanza el error para que pueda ser manejado en el componente
        }
    };

    const createProject = async (project) => {
        try {
            const res = await createProjectRequest(project);
            setProjects((prev) => [...prev, res.data]); // Agrega el nuevo proyecto a la lista
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    const updateProject = async (id, project) => {
        try {
            const res = await updateProjectRequest(id, project);
            setProjects((prev) => prev.map(p => (p._id === id ? res.data : p))); // Actualiza el proyecto en la lista
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };

    const deleteProject = async (id) => {
        try {
            await deleteProjectRequest(id);
            setProjects((prev) => prev.filter(p => p._id !== id)); // Filtra el proyecto eliminado
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    useEffect(() => {
        getProjects();
    }, [getProjects]); // Añadido getProjects a la lista de dependencias

    return (
        <ProjectContext.Provider value={{ projects, createProject, updateProject, deleteProject, getProjects, getProject, error }}>
            {children}
        </ProjectContext.Provider>
    );
};
