import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
    getBingoCardsRequest,
    getBingoCardRequest,
    getBingoCardsWithSalesRequest, // Importamos la nueva función de la API
    createBingoCardRequest,
    deleteBingoCardRequest,
    updateBingoCardRequest,
    getBingoCardStatusRequest,
    assignSellerToBingoCardRequest,
    removeSellerToBingoCardRequest,
    getBingoCardsBySellerRequest
} from "../api/bingoCard.js"; // Asegúrate de que la ruta sea correcta

const BingoCardContext = createContext();

export const useBingoCards = () => {
    const context = useContext(BingoCardContext);
    if (!context) {
        throw new Error("useBingoCards must be used within a BingoCardProvider");
    }
    return context;
};

export const BingoCardProvider = ({ children }) => {
    const [bingoCards, setBingoCards] = useState([]); 
    const [availableBingoCards, setAvailableBingoCards] = useState([]); 
    const [bingoCardsWithSales, setBingoCardsWithSales] = useState([]); // Nuevo estado
    const [error, setError] = useState(null); 

    const getBingoCards = useCallback(async () => {
        try {
            const res = await getBingoCardsRequest();
            console.log("🧩 Cartones obtenidos:", res.data);
            setBingoCards(res.data);
            return res.data;
        } catch (error) {
            console.error("❌ Error al obtener cartones:", error);
            setError(error);
            return null;
        }
    }, []);

    const getAvailableBingoCards = useCallback(async () => {
        try {
            const res = await getBingoCardsRequest({ status: "Disponible" }); // <-- pasamos el filtro
            console.log("🎯 Cartones disponibles:", res.data);
            setAvailableBingoCards(res.data); 
            return res.data;
        } catch (error) {
            console.error("❌ Error al obtener cartones disponibles:", error);
            setError(error);
            return [];
        }
    }, []);

    // Nuevo método para obtener los cartones junto con sus ventas
    const getBingoCardsWithSales = useCallback(async () => {
        try {
            const res = await getBingoCardsWithSalesRequest();
            setBingoCardsWithSales(res.data);
        } catch (error) {
            setError(error);
            console.error("Error al obtener cartones con ventas:", error);
        }
    }, []);

    const getBingoCard = async (id) => {
        try {
            const res = await getBingoCardRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error loading bingo card:", error);
            throw error;
        }
    };

    const createBingoCard = async (bingoCard) => {
        try {
            const res = await createBingoCardRequest(bingoCard);
            setBingoCards((prev) => [...prev, res.data]); 
        } catch (error) {
            console.error("Error creating bingo card:", error);
        }
    };

    const updateBingoCard = async (id, bingoCard) => {
        try {
            const res = await updateBingoCardRequest(id, bingoCard);
            setBingoCards((prev) => prev.map(b => (b._id === id ? res.data : b))); 
        } catch (error) {
            console.error("Error updating bingo card:", error);
        }
    };

    const deleteBingoCard = async (id) => {
        try {
            await deleteBingoCardRequest(id);
            setBingoCards((prev) => prev.filter(b => b._id !== id));
        } catch (error) {
            console.error("Error deleting bingo card:", error);
        }
    };

    const getBingoCardStatus = async (editionId, number) => {
        try {
            const res = await getBingoCardStatusRequest(editionId, number);
            return res.data;
        } catch (err) {
          throw err.response?.data?.message || "Error al consultar el estado del cartón";
        }
      };

    
    const assignSellerToBingoCard = async (id, sellerId) => {
        try {
            const res = await assignSellerToBingoCardRequest(id, sellerId);
            setBingoCards(prev => prev.map(b => (b._id === id ? res.data : b)));
        } catch (error) {
            console.error("Error assigning seller:", error);
        }
    };

    const removeSellerFromBingoCard = async (id) => {
        try {
            const res = await removeSellerToBingoCardRequest(id);
            setBingoCards(prev => prev.map(b => (b._id === id ? res.data : b)));
        } catch (error) {
            console.error("Error removing seller:", error);
        }
    };

    const getBingoCardsBySeller = async (sellerId) => {
        try {
            const res = await getBingoCardsBySellerRequest(sellerId);
            return res.data; // podés hacer setBingoCards(res.data) si querés actualizar el estado global
        } catch (error) {
            console.error("Error fetching bingo cards by seller:", error);
            return [];
        }
    };
    
    

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
    if (!loaded) {
        getBingoCards().then(() => setLoaded(true));
    }
    }, [getBingoCards, loaded]);

    return (
        <BingoCardContext.Provider 
            value={{ 
                bingoCards, 
                bingoCardsWithSales, // Exponemos el nuevo estado
                availableBingoCards,
                createBingoCard, 
                updateBingoCard, 
                deleteBingoCard, 
                getBingoCards, 
                getBingoCard, 
                getBingoCardsWithSales, // Exponemos la nueva función
                getBingoCardStatus,
                getAvailableBingoCards,
                assignSellerToBingoCard,
                removeSellerFromBingoCard,
                getBingoCardsBySeller,
                error 
            }}
        >
            {children}
        </BingoCardContext.Provider>
    );
};
