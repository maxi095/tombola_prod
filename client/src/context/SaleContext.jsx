import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    getSalesRequest,
    getSaleRequest,
    createSaleRequest,
    deleteSaleRequest,
    updateSaleRequest,
    cancelSaleRequest, // Importar la nueva función de la API
    getSalesBySellerRequest
} from "../api/sale.js"; // Asegúrate de que la ruta sea correcta

const SalesContext = createContext();

export const useSales = () => {
    const context = useContext(SalesContext);
    if (!context) {
        throw new Error("useSales must be used within a SalesProvider");
    }
    return context;
};

export const SalesProvider = ({ children }) => {
    const [sales, setSales] = useState([]); 
    const [error, setError] = useState(null); // Estado para manejar errores

    const getSales = useCallback(async () => {
        try {
            const res = await getSalesRequest();
            setSales(res.data); // Asegúrate de que 'res.data' sea un arreglo
        } catch (error) {
            setError(error); // Maneja el error
            console.error(error);
        }
    }, []); // Asegúrate de que esto no cambie en futuras renderizaciones

    const getSale = async (id) => {
        try {
            const res = await getSaleRequest(id);
            return res.data; 
        } catch (error) {
            console.error("Error loading sale:", error);
            throw error; 
        }
    };

    const createSale = async (sale) => {
        try {
            const res = await createSaleRequest(sale);
            setSales((prev) => [...prev, res.data]); 
        } catch (error) {
            console.error("Error creating sale:", error);
        }
    };

    const updateSale = async (id, sale) => {
        try {
            const res = await updateSaleRequest(id, sale);
            setSales((prev) => prev.map(s => (s._id === id ? res.data : s))); 
        } catch (error) {
            console.error("Error updating sale:", error);
        }
    };

    const deleteSale = async (id) => {
        try {
            await deleteSaleRequest(id);
            setSales((prev) => prev.filter(s => s._id !== id)); 
        } catch (error) {
            console.error("Error deleting sale:", error);
        }
    };

    const cancelSale = async (id) => {
        try {
            const res = await cancelSaleRequest(id); // Llamar a la API
            if (res.data) {
                setSales((prev) => prev.map(s => (s._id === id ? { ...s, status: "Anulada" } : s))); // Asegurar actualización del estado
            } else {
                console.error("Error: Respuesta vacía al cancelar la venta");
            }
        } catch (error) {
            console.error("Error canceling sale:", error);
        }
    };

    const getSalesBySeller = async (sellerId) => {
        try {
          const res = await getSalesBySellerRequest(sellerId);
          return res.data;
        } catch (error) {
          console.error("Error obteniendo ventas por vendedor:", error);
          return [];
        }
      };
    

    useEffect(() => {
        getSales();
    }, [getSales]);

    return (
        <SalesContext.Provider value={{ sales, createSale, updateSale, deleteSale, cancelSale, getSales, getSale, getSalesBySeller, error }}>
            {children}
        </SalesContext.Provider>
    );
};
