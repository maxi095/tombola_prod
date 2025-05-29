import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getSellersRequest,
    getSellerRequest,
    createSellerRequest,
    deleteSellerRequest,
    updateSellerRequest
} from "../api/seller.js"; // Asegurate de que la ruta sea correcta

const SellerContext = createContext();

export const useSellers = () => {
    const context = useContext(SellerContext);
    if (!context) {
        throw new Error("useSellers must be used within a SellerProvider");
    }
    return context;
};

export const SellerProvider = ({ children }) => {
    const [sellers, setSellers] = useState([]);
    const [error, setError] = useState(null);

    const getSellers = useCallback(async () => {
        try {
          const res = await getSellersRequest();
          console.log("✅ Datos recibidos:", res.data); // 👀 esto te muestra si llegó la info
          setSellers(res.data);
        } catch (error) {
          console.error("❌ Error en getSellersRequest:", error.response?.data || error.message);
          setError(error);
        }
      }, []);

    const getSeller = async (id) => {
        try {
            const res = await getSellerRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error loading seller:", error);
            throw error;
        }
    };

    const createSeller = async (seller) => {
        try {
            const res = await createSellerRequest(seller);
            setSellers((prev) => [...prev, res.data]);
        } catch (error) {
            console.error("Error creating seller:", error);
        }
    };

    const updateSeller = async (id, seller) => {
        try {
            const res = await updateSellerRequest(id, seller);
            setSellers((prev) => prev.map(s => (s._id === id ? res.data : s)));
        } catch (error) {
            console.error("Error updating seller:", error);
        }
    };

    const deleteSeller = async (id) => {
        try {
            await deleteSellerRequest(id);
            setSellers((prev) => prev.filter(s => s._id !== id));
        } catch (error) {
            console.error("Error deleting seller:", error);
        }
    };

    useEffect(() => {
        getSellers();
    }, [getSellers]);

    return (
        <SellerContext.Provider value={{
            sellers,
            createSeller,
            updateSeller,
            deleteSeller,
            getSellers,
            getSeller,
            error
        }}>
            {children}
        </SellerContext.Provider>
    );
};
