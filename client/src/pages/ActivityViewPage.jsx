import { useEffect, useState } from "react";
import { useActivity } from "../context/ActivityContext";
import { useParams, useNavigate } from "react-router-dom";
import '../assets/css/Global.css'; 
import '../assets/css/Button.css'; 
import '../assets/css/Table.css';

function ActivityViewPage() {
  const { getActivity } = useActivity();
  const [activity, setActivity] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadActivity() {
      if (params.id) {
        const activityData = await getActivity(params.id);
        setActivity(activityData);
      }
    }
    loadActivity();
  }, [params.id, getActivity]);

  if (!activity) return <p>Cargando...</p>;

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <h1 className="page-title">Detalle de actividad</h1>
      <div className="body">
        <p><strong>Proyecto:</strong> {activity.activityProjectId?.name || "Sin proyecto asociado"}</p>
        <p><strong>Nombre estudiante:</strong> {activity.studentId?.firstName || "N/A"}</p>
        <p><strong>Apellido estudiante:</strong> {activity.studentId?.lastName || "N/A"}</p>
        <p><strong>Unidad académica:</strong> {activity.studentId?.academicUnit?.name || "N/A"}</p>
        <p><strong>Fecha de actividad:</strong> {activity.dateActivity || "N/A"}</p>
        <p><strong>Actividad:</strong> {activity.activityProjectId?.name || "N/A"}</p>
        <p><strong>Horas acreditadas:</strong> {activity.activityProjectId?.hours || "N/A"}</p>
      </div>
      <button 
        onClick={handleCancel} 
        className="button button--return mt-4">
        Volver
      </button>
    </div>
  );
}

export default ActivityViewPage;
