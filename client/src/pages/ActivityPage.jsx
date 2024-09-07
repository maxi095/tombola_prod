import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useActivity } from "../context/ActivityContext";
import dayjs from "dayjs";
import '../assets/css/Global.css';
import ActivityCard from "../components/ActivityCard";

function ActivityPage() {
  const { user } = useAuth(); // Obtén el usuario logueado desde el contexto de autenticación
  const { getActivitiesByUser, error } = useActivity(); // Desestructura la función y el estado
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchActivities = async () => {
      setLoading(true);
      try {
        
        if (user && user.id) {
          
          const activitiesData = await getActivitiesByUser(user.id); // Obtiene las actividades del usuario
          
          setActivities(activitiesData);
        } else {
          console.warn("User is not logged in or user ID is missing.");
        }
      } catch (err) {
        console.error("Error fetching activities:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]); // Dependencias: `user` y `getActivitiesByUser`

  if (loading) return <p>Cargando...</p>;

  if (!user) return <p>No estás logueado.</p>;

  if (activities.length === 0) return <h1>No tienes actividades registradas.</h1>;

  // Calcular el total de horas acreditadas
  const totalHoursAccredited = activities.reduce((total, activity) => total + (activity.activityProjectId?.hours || 0), 0);

  // Calcular el porcentaje de progreso
  const totalExpectedHours = 30; // Puedes ajustar este valor según sea necesario
  const progressPercentage = (totalHoursAccredited / totalExpectedHours) * 100;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Mis Actividades</h1>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="text-lg font-semibold mb-2">
          Progreso de horas
        </div>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200 mr-3">
              {totalHoursAccredited} / {totalExpectedHours} horas
            </div>
            <div className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
              {Math.round(progressPercentage)}%
            </div>
          </div>
          <div className="flex mb-2 items-center justify-between">
            <div className="relative w-full max-w-md">
              <div className="flex items-center justify-between w-full text-xs font-semibold">
                <div className="text-teal-600">{Math.round(progressPercentage)}%</div>
                <div className="text-teal-600">100%</div>
              </div>
              <div className="flex w-full bg-gray-300 h-2 rounded">
                <div
                  className="bg-teal-600 h-full rounded"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-500 p-2 text-white my-2">{error}</div>}
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
    {
      activities.map(activity => (
        <ActivityCard activity = {activity} key = {activity._id}></ActivityCard>
      ))
    }
  </div>
    </div>
  );
}

export default ActivityPage;
