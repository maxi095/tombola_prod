import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useActivity } from "../context/ActivityContext";
import '../assets/css/Global.css';
import ActivityCard from "../components/ActivityCard";

function ActivityPage() {
  const { user } = useAuth(); // Obtén el usuario logueado desde el contexto de autenticación
  const { getActivitiesByUser, error } = useActivity(); // Desestructura la función y el estado
  const [groupedActivities, setGroupedActivities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        if (user && user.id) {
          const activitiesData = await getActivitiesByUser(user.id); // Obtiene las actividades del usuario

          // Agrupar actividades por proyecto
          const activitiesByProject = activitiesData.reduce((acc, activity) => {
            const projectId = activity.activityProjectId.project._id;
            if (!acc[projectId]) {
              acc[projectId] = {
                projectName: activity.activityProjectId.project.name, // Aquí se asegura que se tome el nombre del proyecto
                totalHoursAccredited: 0,
                activities: [],
              };
            }
            acc[projectId].totalHoursAccredited += activity.activityProjectId.hours || 0;
            acc[projectId].activities.push(activity);
            return acc;
          }, {});

          setGroupedActivities(activitiesByProject);
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

  if (Object.keys(groupedActivities).length === 0) return <h1>No tienes actividades registradas.</h1>;

  const totalExpectedHours = 30; // Puedes ajustar este valor según sea necesario

  // Función para determinar el color basado en el porcentaje
  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'bg-red-500'; // Rojo
    if (percentage < 100) return 'bg-yellow-500'; // Amarillo
    return 'bg-green-500'; // Verde
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Mis actividades</h1>

      {error && <div className="bg-red-500 p-2 text-white my-2">{error}</div>}

      {Object.keys(groupedActivities).map(projectId => {
        const project = groupedActivities[projectId];
        const progressPercentage = (project.totalHoursAccredited / totalExpectedHours) * 100;

        return (
          <div key={projectId} className="mb-6">
            <h2 className="text-xl font-bold mb-2">Proyecto: {project.projectName}</h2>
            
            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className={`text-xs font-semibold inline-block py-1 px-2 rounded ${getProgressColor(progressPercentage)}`}>
                    {project.totalHoursAccredited} / {totalExpectedHours} horas
                  </div>
                  <div className={`text-xs font-semibold inline-block py-1 px-2 rounded ${getProgressColor(progressPercentage)}`}>
                    {Math.round(progressPercentage)}%
                  </div>
                </div>
                <div className="flex mb-2 items-center justify-between">
                  <div className="relative w-full max-w-md">
                    <div className="flex items-center justify-between w-full text-xs font-semibold">
                      <div className="text-black-600 font-bold">{Math.round(progressPercentage)}%</div>
                      <div className="text-black-600 font-bold">100%</div>
                    </div>
                    <div className="flex w-full bg-gray-300 h-5 rounded">
                      <div
                        className={`h-full rounded ${getProgressColor(progressPercentage)}`} // Color dinámico
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mostrar actividades */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {project.activities.map(activity => (
                <ActivityCard activity={activity} key={activity._id} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ActivityPage;
