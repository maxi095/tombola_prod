import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { useActivity } from "../context/ActivityContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import '../assets/css/Global.css'; 
import '../assets/css/Button.css'; 
import '../assets/css/Table.css';

function UserDetailPage() {
  const { getUser } = useUsers();
  const { getActivitiesByUser } = useActivity();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [groupedActivities, setGroupedActivities] = useState({});
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await getUser(id);
        setUser(userData);

        // Solo intenta obtener actividades si el usuario existe
        if (userData) {
          const activitiesData = await getActivitiesByUser(id);

          // Agrupar actividades por proyecto
          const activitiesByProject = activitiesData.reduce((acc, activity) => {
            const projectId = activity.activityProjectId?.project?._id;
            if (!projectId) return acc;

            if (!acc[projectId]) {
              acc[projectId] = {
                projectName: activity.activityProjectId.project.name, // Nombre del proyecto
                totalHoursAccredited: 0,
                activities: [],
              };
            }
            acc[projectId].totalHoursAccredited += activity.activityProjectId?.hours || 0;
            acc[projectId].activities.push(activity);
            return acc;
          }, {});

          setGroupedActivities(activitiesByProject);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getUser, getActivitiesByUser]);

  if (loading) return <p>Cargando...</p>;

  if (!user) return <p>Usuario no encontrado</p>;

  const handleCancel = () => {
    navigate(-1); // Navega hacia atrás
  };

  // Función para determinar el color basado en el porcentaje
  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'bg-red-500'; // Rojo
    if (percentage < 100) return 'bg-yellow-500'; // Amarillo
    return 'bg-green-500'; // Verde
  };

  const totalExpectedHours = 30; // Ajusta este valor según sea necesario

  return (
    <div>
      <h1 className="page-title">Detalle del usuario {user.lastName} {user.firstName}</h1>

      {/* Tabs */}
      <div className="mb-4">
        <button 
          className={`px-4 py-2 ${activeTab === "info" ? "tab-active" : "tab-inactive"}`}
          onClick={() => setActiveTab("info")}
        >
          Información
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === "activities" ? "tab-active" : "tab-inactive"}`}
          onClick={() => setActiveTab("activities")}
        >
          Actividades
        </button>
      </div>

      {activeTab === "info" && (
        <div className="body">
          <p className="mb-2"><strong>Username:</strong> {user.username}</p>
          <p className="mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="mb-2"><strong>Documento:</strong> {user.document}</p>
          <p className="mb-2"><strong>Unidad académica:</strong> {user.academicUnit?.name || 'Sin unidad académica'}</p>
          <p className="mb-2"><strong>Rol:</strong> {user.roles}</p>
        </div>
      )}

      {activeTab === "activities" && (
        <div className="container">
          {/* Recorrer cada proyecto y mostrar barra de progreso y actividades por proyecto */}
          {Object.keys(groupedActivities).map((projectId) => {
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

                {/* Tabla de actividades para cada proyecto */}
                {project.activities.length === 0 ? (
                  <p>No hay actividades registradas para este proyecto.</p>
                ) : (
                  <table className="standard-table">
                    <thead>
                      <tr>
                        <th>Actividad</th>
                        <th>Fecha de actividad</th>
                        <th>Horas acreditadas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.activities.map(activity => (
                        <tr key={activity._id}>
                          <td>
                            {activity.activityProjectId?.name || 'Sin nombre de actividad'}
                          </td>
                          <td>
                            {dayjs.utc(activity.activityProjectId?.dateActivity).format('DD/MM/YYYY')}
                          </td>
                          <td>
                            {activity.activityProjectId?.hours || 'Sin horas de actividad'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button 
        onClick={handleCancel} 
        className="button button--return">
        Volver
      </button>
    </div>
  );
}

export default UserDetailPage;
