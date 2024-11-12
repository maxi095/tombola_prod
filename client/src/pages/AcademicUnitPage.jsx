import { useEffect } from "react";
import { useAcademicUnits } from "../context/AcademicUnitContext"; 
import { Link } from "react-router-dom";
import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 
import { useAuth } from "../context/AuthContext";

function AcademicUnitPage() {
  const { getAcademicUnits, academicUnits, deleteAcademicUnit } = useAcademicUnits();
  const { user } = useAuth(); 

  useEffect(() => {
    if (user) {
    const fetchAcademicUnits = async () => {
      try {
        await getAcademicUnits(); // Asegúrate de que getAcademicUnits maneje posibles errores
      } catch (error) {
        console.error("Error fetching academic units:", error);
      }
    };
  
    fetchAcademicUnits();
  }}, [getAcademicUnits]); // Añadido getAcademicUnits a la lista de dependencias
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta unidad académica?");
    if (confirmDelete) {
      try {
        await deleteAcademicUnit(id);
        await getAcademicUnits(); // Vuelve a obtener la lista de unidades académicas después de eliminar
      } catch (error) {
        console.error("Error deleting academic unit:", error);
      }
    }
  };

  if (!academicUnits || academicUnits.length === 0) {
    return <h1>No hay unidades académicas</h1>;
  }

  return (
    <div className="container">
      <h1 className="page-title">Unidades académicas</h1>
      <Link to="/academic-units/new" className="button button--new mb-4 inline-block">
        Crear unidad académica
      </Link>
      <table className="standard-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th> {/* Nueva columna para acciones */}
          </tr>
        </thead>
        <tbody>
          {academicUnits.map((unit) => (
            <tr key={unit._id}>
              <td>{unit.name}</td>
              <td>{unit.description}</td>
              <td>
                <Link to={`/academic-units/edit/${unit._id}`} className="button button--edit mr-2">
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(unit._id)} 
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

export default AcademicUnitPage;
