import { useEffect } from "react";
import { useProjects } from "../context/ProjectContext"; 
import { Link } from "react-router-dom";
import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

function ProjectPage() {
  const { getProjects, projects, deleteProject } = useProjects();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        await getProjects(); // Asegúrate de que getProjects maneje posibles errores
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    fetchProjects();
  }, [getProjects]); // Añadido getProjects a la lista de dependencias
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este proyecto?");
    if (confirmDelete) {
      try {
        await deleteProject(id);
        await getProjects(); // Vuelve a obtener la lista de proyectos después de eliminar
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  if (!projects || projects.length === 0) {
    return ( 
      <div>
      <h1 className="page-title">No existen proyectos registrados</h1>;
      <Link to="/projects/new" className="button button--new mb-4 inline-block">
          Crear proyecto
        </Link>
      </div>
        );
  }

  return (
    <div className="container">
      <h1 className="page-title">Proyectos</h1>
      <Link to="/projects/new" className="button button--new mb-4 inline-block">
        Crear proyecto
      </Link>
      <table className="standard-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Usuario</th>
            <th>Dimensión</th>
            <th>Acciones</th> {/* Nueva columna para acciones */}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{project.user?.username || 'No asignado'}</td>
              <td>{project.dimension?.name || 'Sin dimensión'}</td>
              <td>
                <Link to={`/projects/edit/${project._id}`} className="button button--edit mr-2">
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(project._id)} 
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

export default ProjectPage;
