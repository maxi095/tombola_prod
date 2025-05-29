import { createContext, useContext, useState, useEffect } from 'react';
import {
  getClientsRequest,
  getClientRequest,
  createClientRequest,
  updateClientRequest,
  deleteClientRequest,
} from '../api/client';

const ClientContext = createContext();

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) throw new Error('useClients must be used within a ClientProvider');
  return context;
};

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const getClients = async () => {
    try {
      setLoading(true);
      const res = await getClientsRequest();
      setClients(res.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClient = async (id) => {
    try {
      const res = await getClientRequest(id);
      return res.data;
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  const createClient = async (clientData) => {
    try {
      const res = await createClientRequest(clientData);
      setClients((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  };

  const updateClient = async (id, updatedData) => {
    try {
      const res = await updateClientRequest(id, updatedData);
      setClients((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const deleteClient = async (id) => {
    try {
      await deleteClientRequest(id);
      setClients((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        getClients,
        getClient,
        createClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
