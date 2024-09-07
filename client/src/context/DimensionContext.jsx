import { createContext, useContext, useState, useEffect } from 'react';
import { getDimensionsRequest, createDimensionRequest, updateDimensionRequest, deleteDimensionRequest } from "../api/dimension"; // Ajusta la ruta según tu estructura

const DimensionContext = createContext();

export const useDimensions = () => {
    const context = useContext(DimensionContext);
    if (!context) {
        throw new Error("useDimensions must be used within a DimensionProvider");
    }
    return context;
};

export const DimensionProvider = ({ children }) => {
    const [dimensions, setDimensions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getDimensions = async () => {
        setLoading(true); // Comienza a cargar
        try {
            const res = await getDimensionsRequest();
            if (Array.isArray(res.data)) {
                setDimensions(res.data);
            } else {
                console.error("Expected an array of dimensions");
            }
            setError(null); // Resetea el error si la llamada es exitosa
        } catch (error) {
            setError(error.message); // Guarda el mensaje de error
            console.error(error);
        } finally {
            setLoading(false); // Finaliza la carga
        }
    };

    const createDimension = async (dimension) => {
        try {
            const res = await createDimensionRequest(dimension);
            setDimensions((prev) => [...prev, res.data]); // Agrega la nueva dimensión a la lista
        } catch (error) {
            console.error("Error creating dimension:", error);
        }
    };

    const updateDimension = async (id, dimension) => {
        try {
            const res = await updateDimensionRequest(id, dimension);
            setDimensions((prev) => prev.map(d => (d._id === id ? res.data : d)));
        } catch (error) {
            console.error("Error updating dimension:", error);
        }
    };

    const deleteDimension = async (id) => {
        try {
            await deleteDimensionRequest(id);
            setDimensions((prev) => prev.filter(d => d._id !== id));
        } catch (error) {
            console.error("Error deleting dimension:", error);
        }
    };

    useEffect(() => {
        getDimensions();
    }, []);

    return (
        <DimensionContext.Provider value={{ dimensions, createDimension, updateDimension, deleteDimension, getDimensions, error, loading }}>
            {children}
        </DimensionContext.Provider>
    );
};
