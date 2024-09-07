import { useEffect, useState } from "react";
import { useActivityProjects } from "../context/ActivityProjectContext";
import { useActivity } from "../context/ActivityContext";
import { useParams, useNavigate } from "react-router-dom";
import '../assets/css/Global.css'; 
import '../assets/css/Button.css'; 
import '../assets/css/Table.css';

function ActivityProjectViewPage() {
  const { getActivityProject } = useActivityProjects();
  const { getUsersByActivity } = useActivity();
  const [activityProject, setActivityProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const activityProjectData = await getActivityProject(params.id);
        setActivityProject(activityProjectData);

        if (activeTab === "users") {
          const usersData = await getUsersByActivity(activityProjectData._id);
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Error loading activity project:", error);
        navigate("/activity-projects");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, getActivityProject, getUsersByActivity, activeTab, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCancel = () => {
    navigate(-1); // Navega hacia atrás
  };

  if (loading) return <p>Cargando...</p>;

  if (!activityProject) return <p>Proyecto no encontrado</p>;

  return (
    <div>
      <h1 className="page-title">Detalle del proyecto de actividad</h1>
      <div>
      {/* Tabs */}
      <div className="mb-4">
        <button 
          className={`px-4 py-2 ${activeTab === "details" ? "tab-active" : "tab-inactive"} rounded-l-md`}
          onClick={() => handleTabChange("details")}
        >
          Detalle
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === "users" ? "tab-active" : "tab-inactive"} rounded-l-r`}
          onClick={() => handleTabChange("users")}
        >
          Estudiantes
        </button>
      </div>

      {activeTab === "details" && (
        <div className="body">
          <p className="mb-2"><strong>Nombre del Proyecto:</strong> {activityProject.name}</p>
          <p className="mb-2"><strong>Descripción:</strong> {activityProject.description}</p>
          <p className="mb-2"><strong>Horas acreditadas:</strong> {activityProject.hours}</p>
          <p className="mb-2"><strong>Proyecto asociado:</strong> {activityProject.project?.name || "Sin proyecto asociado"}</p>
        </div>
      )}

      {activeTab === "users" && (
        <div className="container">
          <h3 className="page-sub-title">Estudiantes asociados</h3>
          {users.length === 0 ? (
            <p>No hay estudiantes asociados a esta actividad.</p>
          ) : (
            <table className="standard-table">
              <thead>
                <tr>
                  <th>Nombre de Usuario</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
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
    </div>
  );
}

export default ActivityProjectViewPage;
