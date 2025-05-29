import { createContext, useContext, useState, useCallback } from 'react';
import { getDashboardRequest } from '../api/dashboard'; // Asegurate que este sea el path correcto

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard debe usarse dentro de un DashboardProvider');
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getDashboard = useCallback(async (editionId) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Solicitando datos del dashboard para edición:", editionId);
      const res = await getDashboardRequest(editionId);
      setDashboardData(res.data);
    } catch (err) {
      console.error("Error en getDashboard:", err);
      setError("Error al obtener estadísticas.");
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{
      dashboardData,
      loading,
      error,
      getDashboard
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
