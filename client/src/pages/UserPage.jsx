import { useEffect } from "react";
import { useUsers } from "../context/UserContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserPage() {
  const { getUsers, users, deleteUser } = useUsers();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchUsers = async () => {
        try {
          await getUsers();
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmDelete) {
      try {
        await deleteUser(id);
        await getUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="page-wide">
      <div className="header-bar">
        <h1 className="title">Usuarios</h1>
        <Link to="/users/new" className="btn-primary">
          Crear usuario
        </Link>
      </div>

      {(!users || users.length === 0) ? (
        <p className="empty-state">No hay usuarios registrados.</p>
      ) : (
        <>
          {/* Contador de registros */}
          <div className="record-count">
            Mostrando <strong>{users.length}</strong> usuarios
          </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Usuario</th>
                <th className="table-cell">Nombre</th>
                <th className="table-cell">Apellido</th>
                <th className="table-cell">Documento</th>
                <th className="table-cell">Rol</th>
                <th className="table-cell">Email</th>
                <th className="table-cell">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="table-row">
                  <td className="table-cell">{u.username}</td>
                  <td className="table-cell">{u.person?.firstName || "N/A"}</td>
                  <td className="table-cell">{u.person?.lastName || "N/A"}</td>
                  <td className="table-cell">{u.person?.document || "N/A"}</td>
                  <td className="table-cell">{u.roles || "N/A"}</td>
                  <td className="table-cell">{u.email}</td>
                  <td className="table-cell">
                    <div className="btn-group">
                      {/*<Link to={`/users/view/${u._id}`} className="btn-secondary mr-2">
                        Ver
                      </Link>*/}
                      <Link to={`/users/edit/${u._id}`} className="btn-secondary mr-2">
                        Editar
                      </Link>
                      <button onClick={() => handleDelete(u._id)} className="btn-anular">
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

export default UserPage;
