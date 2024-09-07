import { createContext, useContext, useState, useEffect } from "react";
import {
    createActivityRequest,
    getActivitiesRequest,
    deleteActivityRequest,
    getActivityRequest,
    updateActivityRequest,
    getActivitiesByUserRequest,
    getUsersByActivityRequest // Importa esta función de tu API
} from "../api/activity";

const ActivityContext = createContext();

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error("useActivity must be used within an ActivityProvider");
    }
    return context;
};

export function ActivityProvider({ children }) {
    const [activities, setActivities] = useState([]);
    const [error, setError] = useState(null);

    const getActivities = async () => {
        try {
            setError(null); // Limpiar el estado de error antes de hacer la solicitud
            const res = await getActivitiesRequest();
            setActivities(res.data);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const createActivity = async (activityData) => {
        try {
            setError(null);
            const res = await createActivityRequest(activityData);
            setActivities((prev) => [...prev, res.data]);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const deleteActivity = async (id) => {
        try {
            setError(null);
            const res = await deleteActivityRequest(id);
            if (res.status === 204) {
                setActivities((prev) => prev.filter(activity => activity._id !== id));
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const getActivity = async (id) => {
        try {
            setError(null);
            const res = await getActivityRequest(id);
            return res.data;
        } catch (err) {
            setError(err.message);
            console.error(err);
            return null; // Retorna null si ocurre un error
        }
    };

    const updateActivity = async (id, activityData) => {
        try {
            setError(null);
            const res = await updateActivityRequest(id, activityData);
            setActivities((prev) => prev.map(activity => activity._id === id ? res.data : activity));
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    // Nueva función para obtener actividades por usuario
    const getActivitiesByUser = async (userId) => {
        try {
            setError(null);
            const res = await getActivitiesByUserRequest(userId); // Llama a la API
            return res.data;
        } catch (err) {
            setError(err.message);
            console.error(err);
            return [];
        }
    };

    const getUsersByActivity = async (activityId) => {
        try {
            setError(null);
            const res = await getUsersByActivityRequest(activityId); // Llama a la API
            return res.data;
        } catch (err) {
            setError(err.message);
            console.error(err);
            return []; // Retorna un array vacío si ocurre un error
        }
    };

    useEffect(() => {
        getActivities();
    }, []);

    return (
        <ActivityContext.Provider value={{
            activities,
            createActivity,
            getActivities,
            deleteActivity,
            getActivity,
            updateActivity,
            getActivitiesByUser,
            getUsersByActivity, // Agrega la nueva función al contexto
            error // Puedes acceder a los errores desde el contexto si es necesario
        }}>
            {children}
        </ActivityContext.Provider>
    );
}
