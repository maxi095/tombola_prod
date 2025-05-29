import { useEffect } from "react";
import { useEditions } from "../../context/EditionContext"; 
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function EditionPage() {
  const { getEditions, editions, deleteEdition } = useEditions();
  const { user } = useAuth(); 

  useEffect(() => {
    if (user) {
      const fetchEditions = async () => {
        try {
          await getEditions();
        } catch (error) {
          console.error("Error fetching edition:", error);
        }
      };
      fetchEditions();
    }
  }, [getEditions]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta edición?");
    if (confirmDelete) {
      try {
        await deleteEdition(id);
        await getEditions();
      } catch (error) {
        console.error("Error deleting edition:", error);
      }
    }
  };

  return (
    <div className="page-wide">
      <div className="header-bar">
        <h1 className="title">Ediciones</h1>
        <Link to="/edition/new" className="btn-primary">
          Crear edición
        </Link>
      </div>

      {(!editions || editions.length === 0) ? (
        <p className="empty-state">No hay ediciones disponibles.</p>
      ) : (
        <>
          {/* Contador de registros */}
          <div className="record-count">
            Mostrando <strong>{editions.length}</strong> ediciones
          </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Nombre</th>
                <th className="table-cell">Cantidad cartones</th>
                <th className="table-cell">Costo</th>
                <th className="table-cell">Plan pago</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {editions.map((unit) => (
                <tr key={unit._id} className="table-row">
                  <td className="table-cell">{unit.name}</td>
                  <td className="table-cell">{unit.quantityCartons}</td>
                  <td className="table-cell">{unit.cost}</td>
                  <td className="table-cell">{unit.maxQuotas}</td>
                  <td className="table-cell">
                    <div className="btn-group">
                      <Link to={`/edition/edit/${unit._id}`} className="btn-secondary mr-2">
                        Editar
                      </Link>
                      <button onClick={() => handleDelete(unit._id)} className="btn-anular">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

export default EditionPage;
