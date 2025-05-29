import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    getInstallmentsRequest,
    getInstallmentRequest,
    createInstallmentRequest,
    deleteInstallmentRequest,
    updateInstallmentRequest
} from "../api/installments.api.js"; // Asegúrate de que la ruta sea correcta

const InstallmentsContext = createContext();

export const useInstallments = () => {
    const context = useContext(InstallmentsContext);
    if (!context) {
        throw new Error("useInstallments must be used within an InstallmentsProvider");
    }
    return context;
};

export const InstallmentsProvider = ({ children }) => {
    const [installments, setInstallments] = useState([]); 
    const [error, setError] = useState(null); // Estado para manejar errores

    const getInstallments = useCallback(async () => {
        try {
            const res = await getInstallmentsRequest();
            setInstallments(res.data); // Asegúrate de que 'res.data' sea un arreglo
        } catch (error) {
            setError(error); // Maneja el error
            console.error(error);
        }
    }, []); // Asegúrate de que esto no cambie en futuras renderizaciones

    const getInstallment = async (id) => {
        try {
            const res = await getInstallmentRequest(id); // Asegúrate de que esta función esté definida
            return res.data; // Devuelve la cuota obtenida
        } catch (error) {
            console.error("Error loading installment:", error);
            throw error; // Lanza el error para que pueda ser manejado en el componente
        }
    };

    const createInstallment = async (installment) => {
        try {
            const res = await createInstallmentRequest(installment);
            setInstallments((prev) => [...prev, res.data]); // Agrega la nueva cuota a la lista
        } catch (error) {
            console.error("Error creating installment:", error);
        }
    };

    const updateInstallment = async (id, installment) => {
        try {
            const res = await updateInstallmentRequest(id, installment);
            setInstallments((prev) => prev.map(i => (i._id === id ? res.data : i))); // Actualiza la cuota en la lista
        } catch (error) {
            console.error("Error updating installment:", error);
        }
    };

    const deleteInstallment = async (id) => {
        try {
            await deleteInstallmentRequest(id);
            setInstallments((prev) => prev.filter(i => i._id !== id)); // Filtra la cuota eliminada
        } catch (error) {
            console.error("Error deleting installment:", error);
        }
    };

    useEffect(() => {
        getInstallments();
    }, [getInstallments]); // Añadido getInstallments a la lista de dependencias

    return (
        <InstallmentsContext.Provider value={{ installments, createInstallment, updateInstallment, deleteInstallment, getInstallments, getInstallment, error }}>
            {children}
        </InstallmentsContext.Provider>
    );
};
