import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    getEditionRequest,
    getEditionsRequest,
    createEditionRequest,
    deleteEditionRequest,
    updateEditionRequest
} from "../api/edition.js"; // Cambia la ruta a tu API de unidades académicas

const EditionContext = createContext();

export const useEditions = () => {
    const context = useContext(EditionContext);
    if (!context) {
        throw new Error("useEdition must be used within an EditionProvider");
    }
    return context;
};

export const EditionProvider = ({ children }) => {
    const [editions, setEditions] = useState([]); 
    const [error, setError] = useState(null); // Estado para manejar errores

    {/* 
    const getEditions = useCallback(async () => {
        try {
            const res = await getEditionsRequest();
            console.log("Ediciones personContext: ", res)
            setEditions(res.data); // Asegúrate de que 'res.data' sea un arreglo
        } catch (error) {
            setError(error); // Maneja el error
            console.error(error);
        }
    }, []); // Asegúrate de que esto no cambie en futuras renderizaciones
    */}

    const getEditions = useCallback(async () => {
    try {
        const res = await getEditionsRequest();
        console.log("Ediciones personContext: ", res);
        setEditions(res.data);
        return res.data; // <-- ¡esto es lo importante!
    } catch (error) {
        setError(error);
        console.error(error);
        return []; // <-- devolvé algo por si falla
    }
}, []);


    const getEdition = async (id) => {
        try {
            const res = await getEditionRequest(id); // Asegúrate de que esta función esté definida
            return res.data; // Devuelve la unidad académica obtenida
        } catch (error) {
            console.error("Error loading edition:", error);
            throw error; // Lanza el error para que pueda ser manejado en el componente
        }
    };

    const createEdition = async (edition) => {
        try {
            const res = await createEditionRequest(edition);
            setEditions((prev) => [...prev, res.data]); // Agrega la nueva unidad académica a la lista
        } catch (error) {
            console.error("Error creating editions:", error);
        }
    };

    const updateEdition = async (id, edition) => {
        try {
            const res = await updateEditionRequest(id, edition);
            setEditions((prev) => prev.map(a => (a._id === id ? res.data : a))); // Actualiza la Edition en la lista
        } catch (error) {
            console.error("Error updating edition:", error);
        }
    };

    const deleteEdition = async (id) => {
        try {
            await deleteEditionRequest(id);
            setEditions((prev) => prev.filter(a => a._id !== id)); // Filtra la Edition eliminada
        } catch (error) {
            console.error("Error deleting edition:", error);
        }
    };

    useEffect(() => {
        getEditions();
    }, [getEditions]); // Añadido getEditions a la lista de dependencias

    return (
        <EditionContext.Provider value={{ editions, createEdition, updateEdition, deleteEdition, getEditions, getEdition, error }}>
            {children}
        </EditionContext.Provider>
    );
};
