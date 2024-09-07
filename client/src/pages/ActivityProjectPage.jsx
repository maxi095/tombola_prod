import { useEffect } from "react";
import { useActivityProjects } from "../context/ActivityProjectContext"; 
import { Link } from "react-router-dom";
import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

function ActivityProjectPage() {
  const { getActivityProjects, activityProjects, deleteActivityProject } = useActivityProjects();

  useEffect(() => {
    const fetchActivityProjects = async () => {
      try {
        await getActivityProjects();
      } catch (error) {
        console.error("Error fetching activity projects:", error);
      }
    };
    fetchActivityProjects();
  }, [getActivityProjects]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta actividad del proyecto?");
    if (confirmDelete) {
      try {
        await deleteActivityProject(id);
        await getActivityProjects();
      } catch (error) {
        console.error("Error deleting activity project:", error);
      }
    }
  };

  if (!activityProjects || activityProjects.length === 0) {
    return <h1 className="page-title">No hay actividades de proyecto</h1>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Actividades de proyectos</h1>
      <Link to="/activity-projects/new" className="button button--new mb-4 inline-block">
        Crear actividad
      </Link>
      <table className="standard-table">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Nombre actividad</th>
            <th>Descripción</th>
            <th>Horas acreditadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activityProjects.map((activityProject) => (
            <tr key={activityProject._id}>
              <td>{activityProject.project?.name || 'Sin proyecto'}</td>
              <td>{activityProject.name}</td>
              <td>{activityProject.description}</td>
              <td>{activityProject.hours}</td>
              <td>
                <Link to={`/activity-projects/view/${activityProject._id}`} className="button button--view mr-2">
                  Ver
                </Link>
                <Link to={`/activity-projects/edit/${activityProject._id}`} className="button button--edit mr-2">
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(activityProject._id)} 
                  className="button button--delete"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActivityProjectPage;
