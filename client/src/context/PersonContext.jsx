import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    getSellerRequest,
    getSellersRequest,
    createSellerRequest,
    deleteSellerRequest,
    updateSellerRequest,
    getClientRequest,
    getClientsRequest,
    createClientRequest,
    deleteClientRequest,
    updateClientRequest
} from "../api/person.js"; // Asegurar que las rutas sean correctas

// Contexto para manejar vendedores y clientes
const PersonContext = createContext();

export const usePersons = () => {
    const context = useContext(PersonContext);
    if (!context) {
        throw new Error("usePersons debe ser usado dentro de un PersonProvider");
    }
    return context;
};

export const PersonProvider = ({ children }) => {
    const [sellers, setSellers] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para obtener todos los vendedores
    const getSellers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getSellersRequest();
            console.log("✔️ Vendedores obtenidos:", response.data);
            setSellers(response.data);
            return response.data; // esto permite usar .then()
        } catch (err) {
            console.error('❌ Error al obtener vendedores:', err);
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);
    

    // Función para obtener todos los clientes
    const getClients = useCallback(async () => {
        try {
          setLoading(true);
          const response = await getClientsRequest();
          setClients(response.data);
          return response.data; // 🔥 para que luego puedas hacer .then() en el useEffect
        } catch (err) {
          console.error('Error al obtener clientes', err);
          setError(err);
          return null;
        } finally {
          setLoading(false);
        }
      }, []);
      

    // Función para obtener un vendedor por su ID
    const getSeller = async (id) => {
        try {
            const response = await getSellerRequest(id);
            return response.data;
        } catch (err) {
            console.error('Error al obtener vendedor', err);
            throw err;
        }
    };

    // Función para obtener un cliente por su ID
    const getClient = async (id) => {
        try {
            const response = await getClientRequest(id);
            return response.data;
        } catch (err) {
            console.error('Error al obtener cliente', err);
            throw err;
        }
    };

    // Función para crear un vendedor
    const createSeller = async (sellerData) => {
        try {
            const response = await createSellerRequest(sellerData);
            setSellers((prev) => [...prev, response.data]);
        } catch (err) {
            console.error('Error al crear vendedor', err);
            setError(err);
        }
    };

    // Función para crear un cliente
    const createClient = async (clientData) => {
        try {
            const response = await createClientRequest(clientData);
            setClients((prev) => [...prev, response.data]);
        } catch (err) {
            console.error('Error al crear cliente', err);
            setError(err);
        }
    };

    // Función para actualizar un vendedor
    const updateSeller = async (id, updatedData) => {
        try {
            const response = await updateSellerRequest(id, updatedData);
            setSellers((prev) => prev.map((seller) => (seller._id === id ? response.data : seller)));
        } catch (err) {
            console.error('Error al actualizar vendedor', err);
            setError(err);
        }
    };

    // Función para actualizar un cliente
    const updateClient = async (id, updatedData) => {
        try {
            const response = await updateClientRequest(id, updatedData);
            setClients((prev) => prev.map((client) => (client._id === id ? response.data : client)));
        } catch (err) {
            console.error('Error al actualizar cliente', err);
            setError(err);
        }
    };

    // Función para eliminar un vendedor
    const deleteSeller = async (id) => {
        try {
            await deleteSellerRequest(id);
            setSellers((prev) => prev.filter((seller) => seller._id !== id));
        } catch (err) {
            console.error('Error al eliminar vendedor', err);
            setError(err);
        }
    };

    // Función para eliminar un cliente
    const deleteClient = async (id) => {
        try {
            await deleteClientRequest(id);
            setClients((prev) => prev.filter((client) => client._id !== id));
        } catch (err) {
            console.error('Error al eliminar cliente', err);
            setError(err);
        }
    };

    // Cargar vendedores y clientes al montar el componente
    useEffect(() => {
        getSellers();
        getClients();
    }, [getSellers, getClients]);

    return (
        <PersonContext.Provider
            value={{
                sellers,
                clients,
                getSellers,
                getClients,
                getSeller,
                getClient,
                createSeller,
                createClient,
                updateSeller,
                updateClient,
                deleteSeller,
                deleteClient,
                loading,
                error
            }}
        >
            {children}
        </PersonContext.Provider>
    );
};
