import { useEffect, useState } from "react";
import { useActivity } from "../context/ActivityContext";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css';  

dayjs.extend(utc);

function ActivityStudentPage() {
  const { getActivities, activities, deleteActivity } = useActivity();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await getActivities();
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);  // Indica que la carga de datos ha terminado
      }
    };

    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta actividad?");
    if (confirmDelete) {
      try {
        setLoading(true);
        await deleteActivity(id);
        await getActivities(); 
      } catch (error) {
        console.error("Error deleting activity:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (!activities || activities.length === 0) {
    return ( 
    <div>
    <h1 className="page-title">No existen actividades registradas</h1>;
    <Link to="/activities/new" className="button button--new mb-4 inline-block">
        Crear actividad
      </Link>
    </div>
      );
  }

  return (
    <div className="container">
      <h1 className="page-title">Actividades de estudiantes</h1>
      <Link to="/activities/new" className="button button--new mb-4 inline-block">
        Crear actividad
      </Link>
      <table className="standard-table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Proyecto</th>
            <th>Actividad del proyecto</th>
            <th>Fecha de la actividad</th>
            <th>Horas acreditadas</th>
            <th>Fecha de registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => {
              // Verificación de datos
              if (!activity.activityProjectId || !activity.activityProjectId.project) {
                  return (
                      <tr key={activity._id} >
                          <td colSpan="5">Datos incompletos</td>
                      </tr>
                  );
              }
              return (
                  <tr key={activity._id}>
                      <td>
                          {`${activity.studentId?.firstName || 'Nombre no disponible'} ${activity.studentId?.lastName || ''}`}
                      </td>
                      <td>
                          {activity.activityProjectId?.project?.name || 'Sin nombre de proyecto'}
                      </td>
                      <td>
                          {activity.activityProjectId?.name || 'Sin nombre de actividad'}
                      </td>
                      <td>
                          {dayjs(activity.activityProjectId?.dateActivity).utc().format('DD/MM/YYYY') || 'Sin fecha de actividad'}
                      </td>
                      <td>
                          {activity.activityProjectId?.hours || 'Sin horas de actividad'}
                      </td>
                      <td>
                          {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Sin fecha de registro'}
                      </td>
                      <td>

                          <Link to={`/activities/view/${activity._id}`} className="button button--view mr-2">
                            Ver
                          </Link>
                          <Link to={`/activities/edit/${activity._id}`} className="button button--edit mr-2">
                              Editar
                          </Link>
                          <button 
                              onClick={() => handleDelete(activity._id)} 
                              className="button button--delete"
                          >
                              Eliminar
                          </button>
                    
                      </td>
                  </tr>
              );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityStudentPage;
