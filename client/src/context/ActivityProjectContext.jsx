import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    getActivityProjectsRequest, 
    getActivityProjectRequest, 
    createActivityProjectRequest, 
    updateActivityProjectRequest, 
    deleteActivityProjectRequest 
} from "../api/activityProject"; // Asegúrate de que la ruta sea correcta

const ActivityProjectContext = createContext();

export const useActivityProjects = () => {
    const context = useContext(ActivityProjectContext);
    if (!context) {
        throw new Error("useActivityProjects must be used within an ActivityProjectProvider");
    }
    return context;
};

export const ActivityProjectProvider = ({ children }) => {
    const [activityProjects, setActivityProjects] = useState([]);
    const [error, setError] = useState(null); // Estado para manejar errores

    const getActivityProjects = useCallback(async () => {
        try {
            const res = await getActivityProjectsRequest();
            if (Array.isArray(res.data)) { // Asegúrate de que 'res.data' sea un arreglo
                setActivityProjects(res.data);
            } else {
                throw new Error("Unexpected response data format");
            }
        } catch (error) {
            setError(error); // Maneja el error
            console.error("Error fetching activity projects:", error);
        }
    }, []); // Este hook se asegura de que la función no cambie entre renderizaciones

    const getActivityProject = async (id) => {
        try {
            const res = await getActivityProjectRequest(id);
            return res.data; // Devuelve la actividad obtenida
        } catch (error) {
            console.error("Error loading activity project:", error);
            throw error; // Lanza el error para que pueda ser manejado en el componente
        }
    };

    const createActivityProject = async (activityProject) => {
        try {
            const res = await createActivityProjectRequest(activityProject);
            setActivityProjects((prev) => [...prev, res.data]); // Agrega la nueva actividad a la lista
        } catch (error) {
            console.error("Error creating activity project:", error);
            setError(error);
        }
    };

    const updateActivityProject = async (id, activityProject) => {
        try {
            const res = await updateActivityProjectRequest(id, activityProject);
            setActivityProjects((prev) => prev.map(a => (a._id === id ? res.data : a))); // Actualiza la actividad en la lista
        } catch (error) {
            console.error("Error updating activity project:", error);
            setError(error);
        }
    };

    const deleteActivityProject = async (id) => {
        try {
            await deleteActivityProjectRequest(id);
            setActivityProjects((prev) => prev.filter(a => a._id !== id)); // Filtra la actividad eliminada
        } catch (error) {
            console.error("Error deleting activity project:", error);
            setError(error);
        }
    };

    useEffect(() => {
        getActivityProjects();
    }, [getActivityProjects]); // Añadido getActivityProjects a la lista de dependencias para asegurar que se actualice correctamente

    return (
        <ActivityProjectContext.Provider value={{ 
            activityProjects, 
            createActivityProject, 
            updateActivityProject, 
            deleteActivityProject, 
            getActivityProjects, 
            getActivityProject, 
            error 
        }}>
            {children}
        </ActivityProjectContext.Provider>
    );
};
