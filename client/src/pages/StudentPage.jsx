import { useEffect } from "react";
import { useUsers } from "../context/UserContext";
import { Link } from "react-router-dom";
import '../assets/css/Global.css';  
import '../assets/css/Table.css';   
import '../assets/css/Button.css'; 

function StudentPage() {
  const { getStudents, users, deleteUser } = useUsers(); // Asegúrate de tener deleteUser en el contexto

  useEffect(() => {
    getStudents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmDelete) {
      try {
        await deleteUser(id);
        await getStudents(); 
      } catch (error) {
        console.error("Error deleting user:", error);
      } 
    }
  };

  if (!users || users.length === 0) return <h1>No existen estudiantes registrados</h1>;

  return (
    <div className="container">
      <h1 className="page-title">Estudiantes</h1>
      <Link to="/students/new" className="button button--new mb-4 inline-block">
        Crear estudiante
      </Link>
      <table className="standard-table">
        <thead>
          <tr>
            <th>Nombre de usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Rol</th>
            <th>Unidad académica</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.firstName || 'N/A'}</td>
              <td>{user.lastName || 'N/A'}</td>
              <td>{user.roles || 'N/A'}</td>
              <td>{user.academicUnit?.name || 'N/A'}</td>
              <td>{user.email}</td>
              <td>
                  <Link
                    to={`/users/view/${user._id}`}
                    className="button button--view mr-2"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/students/edit/${user._id}`}
                    className="button button--edit mr-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
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

export default StudentPage;
