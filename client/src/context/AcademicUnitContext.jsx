import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    getAcademicUnitsRequest, 
    getAcademicUnitRequest, 
    createAcademicUnitRequest, 
    updateAcademicUnitRequest, 
    deleteAcademicUnitRequest 
} from "../api/academicUnit"; // Cambia la ruta a tu API de unidades académicas

const AcademicUnitContext = createContext();

export const useAcademicUnits = () => {
    const context = useContext(AcademicUnitContext);
    if (!context) {
        throw new Error("useAcademicUnits must be used within an AcademicUnitProvider");
    }
    return context;
};

export const AcademicUnitProvider = ({ children }) => {
    const [academicUnits, setAcademicUnits] = useState([]); 
    const [error, setError] = useState(null); // Estado para manejar errores

    const getAcademicUnits = useCallback(async () => {
        try {
            const res = await getAcademicUnitsRequest();
            setAcademicUnits(res.data); // Asegúrate de que 'res.data' sea un arreglo
        } catch (error) {
            setError(error); // Maneja el error
            console.error(error);
        }
    }, []); // Asegúrate de que esto no cambie en futuras renderizaciones

    const getAcademicUnit = async (id) => {
        try {
            const res = await getAcademicUnitRequest(id); // Asegúrate de que esta función esté definida
            return res.data; // Devuelve la unidad académica obtenida
        } catch (error) {
            console.error("Error loading academic unit:", error);
            throw error; // Lanza el error para que pueda ser manejado en el componente
        }
    };

    const createAcademicUnit = async (academicUnit) => {
        try {
            const res = await createAcademicUnitRequest(academicUnit);
            setAcademicUnits((prev) => [...prev, res.data]); // Agrega la nueva unidad académica a la lista
        } catch (error) {
            console.error("Error creating academic unit:", error);
        }
    };

    const updateAcademicUnit = async (id, academicUnit) => {
        try {
            const res = await updateAcademicUnitRequest(id, academicUnit);
            setAcademicUnits((prev) => prev.map(a => (a._id === id ? res.data : a))); // Actualiza la unidad académica en la lista
        } catch (error) {
            console.error("Error updating academic unit:", error);
        }
    };

    const deleteAcademicUnit = async (id) => {
        try {
            await deleteAcademicUnitRequest(id);
            setAcademicUnits((prev) => prev.filter(a => a._id !== id)); // Filtra la unidad académica eliminada
        } catch (error) {
            console.error("Error deleting academic unit:", error);
        }
    };

    useEffect(() => {
        getAcademicUnits();
    }, [getAcademicUnits]); // Añadido getAcademicUnits a la lista de dependencias

    return (
        <AcademicUnitContext.Provider value={{ academicUnits, createAcademicUnit, updateAcademicUnit, deleteAcademicUnit, getAcademicUnits, getAcademicUnit, error }}>
            {children}
        </AcademicUnitContext.Provider>
    );
};
