import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUsers } from "../context/UserContext";
import { useActivity } from "../context/ActivityContext";
import dayjs from "dayjs";
import '../assets/css/Global.css'; 
import '../assets/css/Button.css'; 
import '../assets/css/Table.css';

function UserDetailPage() {
  const { getUser } = useUsers();
  const { getActivitiesByUser } = useActivity();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
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
          setActivities(activitiesData);
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

  // Calcular el total de horas acreditadas
  const totalHoursAccredited = activities.reduce((total, activity) => total + (activity.activityProjectId?.hours || 0), 0);

  // Calcular el porcentaje de progreso
  const totalExpectedHours = 30;
  const progressPercentage = (totalHoursAccredited / totalExpectedHours) * 100;

  const handleCancel = () => {
    navigate(-1); // Navega hacia atrás
  };

  
  return (
    <div>
      <h1 className="page-title">Detalle del usuario</h1>
      
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
          <p className="mb-2"><strong>Nombre:</strong> {user.firstName}</p>
          <p className="mb-2"><strong>Apellido:</strong> {user.lastName}</p>
          <p className="mb-2"><strong>Documento:</strong> {user.document}</p>
          <p className="mb-2"><strong>Unidad académica:</strong> {user.academicUnit?.name || 'Sin unidad académica'}</p>
          <p className="mb-2"><strong>Roles:</strong> {user.roles}</p>
        </div>
      )}

      {activeTab === "activities" && (
        <div className="container">
          {/* Barra de progreso */}
          <div className="mb-4">
            <h3 className="page-sub-title">
              Progreso de horas
            </h3>
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

          {activities.length === 0 ? (
            <p>No hay actividades registradas para este usuario.</p>
          ) : (
            <table className="standard-table">
              <thead>
                <tr>
                  <th>Proyecto</th>
                  <th>Actividad</th>
                  <th>Fecha de actividad</th>
                  <th>Horas acreditadas</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(activity => (
                  <tr key={activity._id}>
                    <td>
                      {activity.activityProjectId?.project?.name || 'Sin nombre de proyecto'}
                    </td>
                    <td>
                      {activity.activityProjectId?.name || 'Sin nombre de actividad'}
                    </td>
                    <td>
                      {dayjs(activity.dateActivity).format('DD/MM/YYYY')}
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
